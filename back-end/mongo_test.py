from mongo import MongoAPI
from flask import json

data = {
    "database": "NoMoreLabel",
    "collection": "projects"
}
url = "mongodb://localhost:5000/"
mongo_obj = MongoAPI(data, url)
option = {
    "project_id": "abcd1234"
}
print(mongo_obj.find_one(option))

