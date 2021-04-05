from flask import Flask, request, json, Response
from mongo import MongoAPI
import os
from glob import glob
from uuid import uuid4
import base64

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


@app.route('/projects/query', methods=['GET'])
def get_query_set():
    project_id = request.args.get('project_id')
    page = int(request.args.get('page'))-1 or 0
    page_size = int(request.args.get('page_size')) or 0
    mongo_obj = MongoAPI(generate_connection_config('images'), mongo_url)
    response = mongo_obj.read(option={
        "project_id": project_id,
        "image_set": "QUERY"
    }, skip=page*page_size, limit=page_size
    )

    return Response(
        response=json.dumps(response),
        status=200,
        mimetype='application/json'
    )


@app.route('/projects/labeled', methods=['GET'])
def get_labeled_set():
    project_id = request.args.get('project_id')
    page = int(request.args.get('page'))-1 or 0
    page_size = int(request.args.get('page_size')) or 0
    label_type = request.args.get('type') if request.args.get('type') in [
        "MANUAL", "AUTO"] else None
    mongo_obj = MongoAPI(generate_connection_config('images'), mongo_url)
    option = {
        "project_id": project_id,
        "image_set": "LABELED"
    }
    if label_type:
        option["type"] = label_type
    response = mongo_obj.read(option=option, skip=page*page_size, limit=page_size
                              )

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
        "project_id": project_id,
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


@app.route('/images', methods=['GET'])
def get_image():
    image_id = request.args.get('image_id')
    mongo_obj = MongoAPI(generate_connection_config('images'), mongo_url)
    if image_id == None:
        response = mongo_obj.read()
        return Response(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )
    else:
        response = mongo_obj.find_one({"image_id": image_id})
        with open(response['image_path'], "rb") as imageFile:
            blob = base64.b64encode(imageFile.read())
        response['blob'] = str(blob)
        return Response(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )


@app.route('/images', methods=['POST'])
def manual_label():
    image_id = request.json.get('image_id')
    class_id = request.json.get('class_id')
    if image_id is None or image_id == {} or class_id is None or class_id == {}:
        return Response(response=json.dumps({"Error": "Please provide labeling information"}),
                        status=400,
                        mimetype='application/json')
    mongo_images = MongoAPI(generate_connection_config('images'), mongo_url)
    image = mongo_images.find_one(option={"image_id": image_id})
    project_id = image['project_id']
    mongo_projects = MongoAPI(
        generate_connection_config('projects'), mongo_url)
    project = mongo_projects.find_one(option={"project_id": project_id})
    image_classes_id = [p['class_id'] for p in project['image_classes']]
    if class_id not in image_classes_id:
        return Response(response=json.dumps({"Error": "class with such id does not exist in this project"}),
                        status=400,
                        mimetype='application/json')
    response = mongo_images.update(image, {"$set": {
        "image_set": "LABELED",
        "type": "MANUAL",
        "class_id": class_id
    }})

    return Response(
        response=json.dumps(response),
        status=200,
        mimetype='application/json'
    )


if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
