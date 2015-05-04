from flask import Flask
from flask import render_template
from pymongo import Connection
import json
from bson import json_util
from bson.json_util import dumps
from datetime import datetime

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'test'
COLLECTION_NAME = 'accern'
FIELDS = {'harvested_at':True,"source_id":True,'entities.ticker':True, "event_source_rank":True,"article_url":True,"_id":False}
start = datetime(2012, 9, 25, 0, 00, 00)
print start
# @app.route("/")
# def index():
#     return render_template("index.html")
@app.route("/")
def index():
        return render_template("v1.html")

@app.route("/serve/")
def test_projects():
    connection = Connection(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find({"harvested_at" : {"$gte": start}},fields=FIELDS).limit(100000)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.disconnect()
    return json_projects
if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8181,debug=True)




