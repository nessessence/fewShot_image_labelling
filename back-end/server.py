from flask import Flask, request, json, Response
from mongo import MongoAPI

app = Flask(__name__)
mongo_url = "mongodb://localhost:5000/"
def generate_connection_config(collection):
    return {
        "database": "NoMoreLabel",
        "collection": collection
    }

@app.route('/')
def base():
    return Response(
        response=json.dumps({"status": "up"}),
        status=200,
        mimetype='application/json'
    )

# absolute path of the test folder :
# /c/Users/HP/Desktop/root-test
@app.route('/projects', methods=['GET'])
def get_all_project():
    mongo_obj = MongoAPI(generate_connection_config('projects'), mongo_url)
    response = mongo_obj.read()
    return Response(
        response=json.dumps(response),
        status=200,
        mimetype='application/json'
    )

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')