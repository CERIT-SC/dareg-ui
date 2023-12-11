from app import *
import os

base_directory = "./instance"
subfolders = ["scheme", "ui_scheme", "data"]

if not os.path.exists(os.path.join(base_directory, "db.sqlite3")):
    with app.app_context():
        db.create_all()

if not os.path.exists(base_directory):
    os.makedirs(base_directory)

for folder in subfolders:
    folder_path = os.path.join(base_directory, folder)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)