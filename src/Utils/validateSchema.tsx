import Ajv from "ajv"

const validateSchema = (schema: any, data: any) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  console.log(validate)
  const valid = validate(data);
  if (!valid) {
    console.log(validate.errors);
    return false;
  }
  return true;
}

export default validateSchema;