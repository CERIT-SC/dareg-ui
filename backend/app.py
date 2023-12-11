from datetime import datetime
from flask import *
from flask_sqlalchemy import SQLAlchemy
import uuid
from functools import wraps
from flask_cors import CORS
import jwt
from sqlalchemy.exc import IntegrityError
from sqlalchemy import update
from sqlalchemy.dialects.sqlite import JSON

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SECRET_KEY'] = "kjigjeriogerigsiejgiosjergj7Z37843"
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

INSTANCE_STORAGE_DIR = "instance"

db = SQLAlchemy(app)

def gen_key():
    return (str(uuid.uuid4().hex))[:-12]

def request_format(keys):
    def deco(f):
        @wraps(f)
        def inner(*args, **kwargs):
            for x in keys:
                if x not in request.json:
                    return {"response":f"{x} key missing"}, 400
                return f(*args, **kwargs)
        return inner
    return deco

class User(db.Model):
    __tablename__    = 'users'
    id = db.Column(db.String(20), nullable=False, primary_key=True, default=gen_key)
    user_login = db.Column(db.String(64), nullable=False, primary_key=True, unique=True)
    name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def create(self, login, name="", email=""):
        """Create a new user"""
        user = self.get_by_login(login)
        if user:
            return
        new_user = User(user_login=login, name=name, email=email)
        db.session.add(new_user)
        db.session.commit()
        return new_user
    
    def get_by_login(self, login):
        user = User.query.filter_by(user_login=login).first()
        if not user:
            return
        return user

    def get_by_id(self, id):
        user = self.query.filter_by(id=id).first()
        if not user:
            return
        return user
    
    def update_last_login(self):
        db.session.execute(update(table=User).where(self.user_login==self.user_login).values(last_login=datetime.utcnow()))

class Template(db.Model):
    id = db.Column(db.String(20), nullable=False, primary_key=True, default=gen_key)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(2000), nullable=False)
    scheme_available = db.Column(db.Boolean, default=False)
    scheme = db.Column(JSON, default="{}")
    uischeme = db.Column(JSON, default="{}")
    creator = db.Column(db.String(20), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Node(db.Model):
    id = db.Column(db.String(20), nullable=False, primary_key=True, default=gen_key)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(2000), nullable=False)
    upper = db.Column(db.String(20), db.ForeignKey('node.id'))
    default_template = db.Column(db.String(20), db.ForeignKey('template.id'))
    creator = db.Column(db.String(20), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Form(db.Model):
    id = db.Column(db.String(20), nullable=False, primary_key=True, default=gen_key)
    node = db.Column(db.String(20), db.ForeignKey('node.id'))
    used_template = db.Column(db.String(20), db.ForeignKey('template.id'))
    data = db.Column(JSON, default="{}")
    creator = db.Column(db.String(20), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


def token_required(f):

    def decode_and_validate_token(token):
        unvalidated = jwt.decode(token, options={"verify_signature": False})
        jwks_client = jwt.PyJWKClient("https://login.microsoftonline.com/11904f23-f0db-4cdc-96f7-390bd55fcee8/discovery/v2.0/keys")
        header = jwt.get_unverified_header(token)
        key = jwks_client.get_signing_key(header["kid"]).key
        return jwt.decode(token, key, algorithms=[header["alg"]])

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            data=jwt.decode(token, options={"verify_signature": False})
            current_user=User().get_by_login(data['sub'])
            if current_user is None:
                current_user = User().create(login=data["sub"], name=data["name"], email=data["email"])
            #     return {
            #     "message": "Invalid Authentication token!",
            #     "data": None,
            #     "error": "Unauthorized"
            # }, 401
            # if not current_user["active"]:
            #     abort(403)
            current_user.update_last_login()
        except Exception as e:
            print(str(e))
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500

        return f(current_user, *args, **kwargs)

    return decorated

##################################################################
####
####    TEMPLATES ENDPOINTS
####
##################################################################
@app.route('/api/templates', methods=["GET"])
@token_required
def get_templates(current_user):
    get_temp = [{"id": x.id, "name": x.name, "description": x.description, "created_at": x.created_at, "creator": User.query.filter_by(id=x.creator).first().name} for x in Template.query.all()]

    return get_temp, 200

@app.route('/api/templates/<id>', methods=["GET"])
@token_required
def view_template_id(current_user, id):
    temp = Template.query.filter_by(id=id).first()

    temp_data = {"id": temp.id, "name": temp.name, "description": temp.description, "scheme": temp.scheme, "uischeme": temp.uischeme, "created_at": temp.created_at, "creator": User.query.filter_by(id=temp.creator).first().name }
    return temp_data, 200

@app.route('/api/templates/<id>', methods=["PATCH"])
@token_required
def patch_template(current_user, id):
    json_data = request.get_json()
    if "creator" in json_data.keys():
        json_data.pop("creator")
    if "created_at" in json_data.keys():
        json_data.pop("created_at")
    if "id" in json_data.keys():
        json_data.pop("id")

    try:
        stmt = update(Template).filter_by(id=id).values(**dict(json_data), creator=current_user.id, created_at=datetime.utcnow())
        db.session.execute(stmt)
        db.session.commit()
        return {"code": 200, "message": f"Successfully updated Template object with id={id}."}
    except Exception as err:
        print(err)
        return {"code": 200, "error": "Object with given name already exist!", "message": f"Unexpected {err=}, {type(err)=}"}, 200

    temp_data = {"id": temp.id, "name": temp.name, "descr": temp.description, "scheme": temp.scheme, "ui_scheme": temp.uischeme}
    return temp_data, 200

@request_format(["name", "descr"])
@app.route('/api/templates', methods=["POST"])
@token_required
def new_template(current_user):
    name = request.json["name"]
    descr = request.json["description"]
    scheme = request.json["scheme"]
    ui_scheme = request.json["uischeme"]

    new_templ = Template(name=name, description=descr, creator=current_user.id, scheme=scheme, uischeme=ui_scheme)
    try:
        db.session.add(new_templ)
        db.session.commit()
    except IntegrityError:
        return {"code": 200, "error": "Object with given name already exist!"}, 200
    except Exception as err:
        return {"code": 200, "error": "Object with given name already exist!", "message": f"Unexpected {err=}, {type(err)=}"}, 200

    return {"id": new_templ.id}, 200

##################################################################
####
####    NODES ENDPOINTS
####
##################################################################
@request_format(["name", "descr", "upper", "default_template"])
@token_required
@app.route('/api/new_node', methods=["POST"])
def new_node(current_user):
    name = request.json["name"]
    descr = request.json["descr"]
    upper = request.json["upper"]
    default_template = request.json["default_template"]

    new_node = Node(name=name, description=descr, upper=upper, default_template=default_template, creator=current_user.id)
    db.session.add(new_node)
    db.session.commit()

    return {"id": new_node.id}, 200

@app.route('/api/nodes', methods=["GET"])
@token_required
def get_all_nodes(current_user):
    upper = request.args.get("upper", "")
    query = Node.query.all()
    if "upper" in request.args.keys():
        if upper == "null":
            query = Node.query.filter_by(upper=None).all()
        else:
            query = Node.query.filter_by(upper=upper).all()

    get_proj = [{"id": x.id, "name": x.name, "description": x.description, "creator": User.query.filter_by(id=x.creator).first().name, "created_at": x.created_at, "upper": x.upper} for x in query]

    return get_proj, 200

@app.route('/api/nodes', methods=["POST"])
@token_required
def new_node_s(current_user):
    name = request.json["name"]
    descr = request.json["description"]
    upper = request.json["upper"]
    default_template = request.json["default_template"]

    new_node = Node(name=name, description=descr, upper=upper, default_template=default_template, creator=current_user.id)
    db.session.add(new_node)
    db.session.commit()

    return {"id": new_node.id}, 200

@app.route('/api/nodes/<id>', methods=["GET"])
@token_required
def view_node(current_user, id):
    node = Node.query.filter_by(id=id).first()
    node_data = {"id": node.id, "name": node.name, "description": node.description, "default_template": node.default_template}
    return node_data, 200

@app.route('/api/nodes/<id>', methods=["PATCH"])
@token_required
def node_patch(current_user, id):
    json_data = request.get_json()
    try:
        print(json_data)
        stmt = update(Node).filter_by(id=id).values(**dict(json_data), creator=current_user.id, created_at=datetime.utcnow())
        db.session.execute(stmt)
        db.session.commit()
        return {"code": 200, "message": f"Successfully updated Node object with id={id}."}
    except Exception as err:
        print(err)
        return {"code": 200, "error": "Object with given name already exist!", "message": f"Unexpected {err=}, {type(err)=}"}, 200


##################################################################
####
####    FORMS ENDPOINTS
####
##################################################################
@app.route('/api/form', methods=["GET"])
@token_required
def form_get_by_node(current_user):
    node_id = request.args["node"]
    try:
        form = Form.query.filter_by(node=node_id).first()
        data = {"id": form.id, "node": form.node, "used_template": form.used_template, "data": form.data}
    except Exception as err:
        print(err)
        return {"code": 200, "error": "Object with given name doesn't exist!", "message": f"Unexpected {err=}, {type(err)=}"}, 404
    return data, 200

@app.route('/api/form/<id>', methods=["GET"])
@token_required
def form_get(current_user, id):
    id = request.json["id"]
    try:
        form = Form.query.filter_by(node=id).first()
        data = {"used_template": form.used_template, "data": form.data}
    except Exception as err:
        print(err)
        return {"code": 200, "error": "Object with given name doesn't exist!", "message": f"Unexpected {err=}, {type(err)=}"}, 404
    return data, 200

@app.route('/api/form/', methods=["POST"])
@token_required
def form_post(current_user):
    print(request.json)
    node_id = request.json["node"]
    data = request.json["data"]
    used_template = request.json["used_template"]
    try:
        new_form = Form(node=node_id, data=data, used_template=used_template, creator=current_user.id)
        new_form_data = {"id": new_form.id, "node": node_id, "used_template": new_form.used_template, "data": new_form.data, "creator": new_form.creator, "created_at": new_form.created_at}
        db.session.add(new_form)
        db.session.commit()
    except Exception as err:
        print(err)
        return {"code": 200, "error": "Object with given name already exist!", "message": f"Unexpected {err=}, {type(err)=}"}, 200
    return new_form_data, 200

@app.route('/api/form/<id>', methods=["PATCH"])
@token_required
def form_patch(current_user, id):
    json_data = request.get_json()
    try:
        print(json_data)
        stmt = update(Form).filter_by(id=id).values(**dict(json_data), creator=current_user.id, created_at=datetime.utcnow())
        db.session.execute(stmt)
        db.session.commit()
        return {"code": 200, "message": f"Successfully updated Template object with id={id}."}
    except Exception as err:
        print(err)
        return {"code": 200, "error": "Object with given name already exist!", "message": f"Unexpected {err=}, {type(err)=}"}, 200

# @app.route('/api/form/dataset/<node_id>', methods=["PATCH"])
# @token_required
# def form_patch_by_node(current_user, node_id):
#     json_data = request.get_json()
#     print(json_data)
#     try:
#         stmt = update(Form).filter_by(node=node_id).values(**dict(json_data), creator=current_user.id, created_at=datetime.utcnow())
#         db.session.execute(stmt)
#         db.session.commit()
#         return {"code": 200, "message": f"Successfully updated Template object with id={id}."}
#     except Exception as err:
#         return {"code": 200, "error": "Object with given name already exist!", "message": f"Unexpected {err=}, {type(err)=}"}, 200

@request_format(["id", "scheme", "ui_scheme"])
@token_required
@app.route('/api/save_scheme_form', methods=["POST"])
def save_scheme_form(current_user):
    id = request.json["id"]
    scheme = request.json["scheme"]
    ui_scheme = request.json["ui_scheme"]

    temp = Template.query.filter_by(id=id).first()
    with open(f"{INSTANCE_STORAGE_DIR}/scheme/{temp.id}", "w") as file:
        file.write(scheme)
    with open(f"{INSTANCE_STORAGE_DIR}/ui_scheme/{temp.id}", "w") as file:
        file.write(ui_scheme)

    temp.scheme_available = True
    db.session.commit()

    return {}, 200

@request_format(["id", "used_template", "data"])
@token_required
@app.route('/api/save_form_data', methods=["POST"])
def save_form_data(current_user):
    id = request.json["id"]
    used_template = request.json["used_template"]
    data = request.json["data"]

    node = Node.query.filter_by(id=id).first()
    temp = Template.query.filter_by(id=used_template).first()

    new_form = Form(node=node.id, used_template=temp.id)
    db.session.add(new_form)
    db.session.commit()

    with open(f"{INSTANCE_STORAGE_DIR}/data/{new_form.id}", "w") as file:
        file.write(str(data).replace("\'", "\""))

    return {}, 200

@request_format(["id"])
@token_required
@app.route('/api/view_form', methods=["POST"])
def view_form(current_user):
    id = request.json["id"]
    node = Node.query.filter_by(id=id).first()
    form = Form.query.filter_by(node=id).first()
    temp = Template.query.filter_by(id=form.used_template).first()

    with open(f"{INSTANCE_STORAGE_DIR}/scheme/{temp.id}", "r") as file:
        scheme = file.read()
    with open(f"{INSTANCE_STORAGE_DIR}/ui_scheme/{temp.id}", "r") as file:
        ui_scheme = file.read()
    with open(f"{INSTANCE_STORAGE_DIR}/data/{form.id}", "r") as file:
        data = file.read()

    data = {"name": node.name, "descr": node.description, "scheme": scheme, "ui_scheme": ui_scheme, "data": data}
    return data, 200


if __name__ == '__main__':
    app.run(debug=True)
