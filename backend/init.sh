#! /bin/sh

echo $(pwd)
python3 makedb.py

gunicorn -b :5000 app:app