from mongo import MongoAPI

data = {
    "database": "NoMoreLabel",
    "collection": "projects"
}
url = "mongodb://localhost:5000/"
mongo_obj = MongoAPI(data, url)
print(json.dumps(mongo_obj.read(), indent=4))
