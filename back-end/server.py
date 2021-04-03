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
def get_project():
    project_id = request.args.get('project_id')
    mongo_obj = MongoAPI(generate_connection_config('projects'), mongo_url)
    if project_id == None:
        response = mongo_obj.read()
        return Response(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )
    else:
        response = mongo_obj.find_one({"project_id": project_id})
        return Response(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )


@app.route('/projects', methods=['POST'])
def read_project_folder():
    print('post')


if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
