from pymongo import MongoClient


class MongoAPI:
    def __init__(self, data, url):
        self.client = MongoClient(url)

        database = data['database']
        collection = data['collection']
        cursor = self.client[database]
        self.collection = cursor[collection]
        self.data = data

    def read(self, option=None, skip=0, limit=0):
        documents = self.collection.find(option)
        if skip or limit:
            documents = documents.skip(skip).limit(limit)
        output = [{item: data[item] for item in data if item != '_id'}
                  for data in documents]
        return output

    def find_one(self, option):
        document = self.collection.find_one(option)
        if document == {} or document == None:
            return {}
        output = {key: value for (key, value)
                  in document.items() if key != '_id'}
        return output

    def write(self, document):
        self.collection.insert_one(document)
        output = {'Status': 'Successfully Inserted'}
        return output

    def insert_many(self, document):
        self.collection.insert_many(document)
        output = {'Status': 'Successfully Inserted'}
        return output

    def update(self, query, value):
        response = self.collection.update_one(query, value)
        output = {'Status': 'Successfully Updated' if response.modified_count >
                  0 else "Nothing was updated."}
        return output

    def delete(self, data):
        filt = data['Document']
        response = self.collection.delete_one(filt)
        output = {'Status': 'Successfully Deleted' if response.deleted_count >
                  0 else "Document not found."}
        return output
