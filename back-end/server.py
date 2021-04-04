from flask import Flask, request, json, Response
from mongo import MongoAPI
import os
from glob import glob
from uuid import uuid4

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
    project_path = request.json.get('project_path')
    if project_path is None or project_path == {}:
        return Response(response=json.dumps({"Error": "Please provide project_path"}),
                        status=400,
                        mimetype='application/json')

    project_name = os.path.split(project_path)[-1]
    joined_path = os.path.join(project_path, '*')
    project_id = str(uuid4())
    image_classes = {'unlabeled': '0'}
    images = []
    unlabeled_image_count = None
    for subdir in glob(joined_path):
        dirname = os.path.split(subdir)[-1]
        subdir_file = glob(os.path.join(subdir, '*'), recursive=True)
        if dirname == 'unlabeled':
            unlabeled_image_count = len(subdir_file)
        else:
            image_classes[dirname] = str(uuid4())

    for subdir in glob(joined_path):
        dirname = os.path.split(subdir)[-1]
        subdir_file = glob(os.path.join(subdir, '*'), recursive=True)
        for file in subdir_file:
            class_id = image_classes[dirname]
            images.append({
                "project_id": project_id,
                "image_id": str(uuid4()),
                "image_path": os.path.join(subdir, file),
                "class_id": class_id,
                "method": None,
                "class_score": None,
                "image_set": "QUERY" if class_id == '0' else "SUPPORT",
                "type": None
            })

    new_project = {
        "name": project_name,
        "project_id": str(uuid4()),
        "image_classes": [{
            "class_name": k,
            "class_id": v
        } for (k, v) in image_classes.items()],
        "project_path": project_path,
        "unlabeled_image_count": unlabeled_image_count,
    }
    mongo_projects = MongoAPI(
        generate_connection_config('projects'), mongo_url)
    mongo_projects.write(new_project)
    mongo_images = MongoAPI(generate_connection_config('images'), mongo_url)
    mongo_images.insert_many(images)

    return Response(
        status=200,
        mimetype='application/json'
    )


if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
