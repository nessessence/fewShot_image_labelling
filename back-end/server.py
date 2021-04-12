from flask import Flask, request, json, Response
from mongo import MongoAPI
import os
from glob import glob
from uuid import uuid4
import base64
import cv2
import numpy as np
import pymongo
import shutil


app = Flask(__name__)
mongo_url = "mongodb://localhost:5000/"
database_name = 'NoMoreLabel'
collection_name = ['images', 'projects']


def init_database(mongo_url, database_name, collection_name):
    client = pymongo.MongoClient(mongo_url)
    database_exist = database_name in client.list_database_names()
    if not database_exist:
        db = client[database_name]
        for cn in collection_name:
            db.create_collection(cn)


def generate_connection_config(collection):
    return {
        "database": "NoMoreLabel",
        "collection": collection
    }


def get_preview_image_blob(image_path, dim=(70, 70)):
    image = cv2.imread(image_path)
    image = cv2.resize(image, dim, interpolation=cv2.INTER_AREA)
    _, buffer = cv2.imencode('.jpg', image)
    blob = str(base64.b64encode(buffer))
    return blob


def generate_folder_path(image_path, folder_name):
    folder, filename = os.path.split(image_path)
    root, _ = os.path.split(folder)
    return os.path.join(root, folder_name, filename)


def move_folder(path, new_path):
    if path != new_path:
        shutil.move(path, new_path)
    return True


@app.route('/')
def base():
    return Response(
        response=json.dumps({"status": "up"}),
        status=200,
        mimetype='application/json'
    )


@app.route('/dataroot', methods=['GET'])
def read_dataroot():
    pwd = os.path.abspath(os.getcwd())
    dataroot = os.path.join(pwd, 'dataroot', '*')
    folder_name = glob(dataroot)
    response = {
        'folder_name': folder_name
    }
    return Response(
        response=json.dumps(response),
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
    image_classes = {'query': '0'}
    images = []
    unlabeled_image_count = None
    for subdir in glob(joined_path):
        dirname = os.path.split(subdir)[-1]
        subdir_file = glob(os.path.join(subdir, '*'), recursive=True)
        if dirname == 'query':
            unlabeled_image_count = len(subdir_file)
        else:
            image_classes[dirname] = str(uuid4())

    for subdir in glob(joined_path):
        dirname = os.path.split(subdir)[-1]
        subdir_file = glob(os.path.join(subdir, '*'), recursive=True)
        for file in subdir_file:
            image_path = os.path.join(subdir, file)
            preview_image_blob = get_preview_image_blob(image_path)
            class_id = image_classes[dirname]
            images.append({
                "project_id": project_id,
                "image_id": str(uuid4()),
                "image_path": image_path,
                "class_id": class_id,
                "class_score": None,
                "image_set": "QUERY" if class_id == '0' else "SUPPORT",
                "type": None,
                "preview_image_blob": preview_image_blob
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

    image_classes_map = {p['class_id']: p['class_name']
                         for p in project['image_classes']}
    if class_id not in image_classes_map.keys():
        return Response(response=json.dumps({"Error": "class with such id does not exist in this project"}),
                        status=400,
                        mimetype='application/json')
    current_path = image['image_path']
    new_path = generate_folder_path(current_path, image_classes_map['0'])

    move_folder(current_path, new_path)
    response = mongo_images.update(image, {"$set": {
        "image_set": "LABELED",
        "type": "MANUAL",
        "class_id": class_id,
        "image_path": new_path
    }})

    return Response(
        response=json.dumps(response),
        status=200,
        mimetype='application/json'
    )


@app.route('/recompute', methods=['POST'])
def recompute():
    project_id = request.json.get('project_id')
    mongo_projects = MongoAPI(
        generate_connection_config('projects'), mongo_url)
    project = mongo_projects.find_one(option={'project_id': project_id})
    if project == {}:
        return Response(response=json.dumps({"Error": "project with such id does not exist"}),
                        status=400,
                        mimetype='application/json')
    classes = list(
        filter(lambda x: x['class_id'] != '0',  project['image_classes']))

    mongo_images = MongoAPI(generate_connection_config('images'), mongo_url)
    # dummy class score ------
    classes_id = [c['class_id'] for c in classes]
    support = mongo_images.read(
        option={'image_set': 'SUPPORT', 'project_id': project_id})
    query = mongo_images.read(
        option={'image_set': 'QUERY', 'project_id': project_id})
    class_scores = []
    for img in query:
        score = np.random.rand(len(classes))
        score = score/sum(score)
        class_scores.append({
            'image_id': img['image_id'],
            'class_score': {c: s for c, s in zip(classes_id, score)}
        })
    # ------------------------
    for obj in class_scores:
        mongo_images.update(
            query={"image_id": obj['image_id']},
            value={"$set": {"class_score": obj['class_score']}}
        )

    return Response(
        response=json.dumps({'Status': 'Successfully Updated'}),
        status=200,
        mimetype='application/json'
    )


@app.route('/autolabel', methods=['POST'])
def autolabel():
    project_id = request.json.get('project_id')
    limit = request.json.get('limit')
    if limit is None or limit == {}:
        return Response(response=json.dumps({"Error": "Please provide limit threshold"}),
                        status=400,
                        mimetype='application/json')
    limit = int(limit)
    mongo_projects = MongoAPI(
        generate_connection_config('projects'), mongo_url)
    project = mongo_projects.find_one(option={'project_id': project_id})
    if project == {}:
        return Response(response=json.dumps({"Error": "project with such id does not exist"}),
                        status=400,
                        mimetype='application/json')
    mongo_images = MongoAPI(generate_connection_config('images'), mongo_url)
    query = mongo_images.read(
        option={'image_set': 'QUERY', 'project_id': project_id})
    classes_best_score = []
    for q in query:
        idx = np.argmax(list(q['class_score'].values()))
        best_score = list(q['class_score'].values())[idx]
        if best_score*100 >= limit:
            class_id = list(q['class_score'].keys())[idx]
            classes_best_score.append({
                'class_id': class_id,
                'image_id': q['image_id']
            })
    for obj in classes_best_score:
        mongo_images.update(
            query={'image_id': obj['image_id'], 'project_id': project_id},
            value={'$set': {
                'image_set': 'LABELED',
                'type': 'AUTO',
                'class_id': obj['class_id']
            }}
        )

    return Response(
        response=json.dumps({'Status': 'autolabel update complete'}),
        status=200,
        mimetype='application/json'
    )


@app.route('/add_to_support', methods=['POST'])
def add_to_support():
    project_id = request.json.get('project_id')
    label_type = request.json.get('type')
    if project_id is None or project_id == {} or label_type is None or label_type == {}:
        return Response(response=json.dumps({"Error": "Please provide image set information"}),
                        status=400,
                        mimetype='application/json')
    if label_type not in ["MANUAL", "AUTO"]:
        return Response(response=json.dumps({"Error": "label type does not exist"}),
                        status=400,
                        mimetype='application/json')
    mongo_images = MongoAPI(generate_connection_config('images'), mongo_url)
    mongo_projects = MongoAPI(
        generate_connection_config('projects'), mongo_url)
    images = mongo_images.read(option={
        "project_id": project_id,
        "type": label_type
    })
    project_classes = mongo_projects.find_one(
        {'project_id': project_id})['image_classes']
    class_map = {c['class_id']: c['class_name'] for c in project_classes}
    update_batch = []
    for img in images:
        update_batch.append({
            'image_id': img['image_id'],
            'current_path': img['image_path'],
            'image_path': generate_folder_path(img['image_path'], class_map[img['class_id']])
        })

    for ub in update_batch:
        move_folder(ub['current_path'], ub['image_path'])
        mongo_images.update(
            query={'image_id': ub['image_id']},
            value={'$set': {
                'image_set': 'SUPPORT',
                'image_path': ub['image_path']
            }}
        )

    return Response(
        response=json.dumps(update_batch),
        status=200,
        mimetype='application/json'
    )


if __name__ == '__main__':
    init_database(mongo_url, database_name, collection_name)
    app.run(debug=True, port=5001, host='0.0.0.0')
