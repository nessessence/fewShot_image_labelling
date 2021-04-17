# Projects

**GET** /dataroot

description : _get folders name in dataroot_

    return array of {
        String[]: folder_name
    }

**GET** /projects

description : _get every project info_

    return array of {
        String: name,
        String[]: images_path,
        String[]: classes_name,
        Integer: labeled_class_count,
    }

**GET** /projects?project_id={String}

description : _get project info_

    return {
        String: name,
        String[]: images_path,
        String[]: classes_name,
        Integer: labeled_class_count,
    }

**POST** /projects

description : _create new project from folder in dataroot_

    body {
    	String: project_path
    }

    return {}

**GET** /projects/query?page_size={Integer}&page={Integer}&project_id={String}

description : _get query page data_

    return {
        String[]: preview_image_path,
        String[]: images_id
    }

**GET** /projects/labeled?page_size={Integer}&page={Integer}&project_id={String}&type={"AUTO", "MANUAL"}

description : _get labeled page data by mode_

    return {
        String[]: preview_image_path,
        String[]: images_id
    }

# Image

**GET** /image?image_id={String}

description : _get image data_

    return {
        String[]: class_name_list,
        String[]: class_id_list,
        String[]: class_score_list,
        String: current_class,
        String: image_path,
        String: image_id
    }

**POST** /image

description : _manually label an image, edit image current class_

    body {
        String: image_id,
        String: class_id
    }

    return {}

**GET** /count?image_set={String}&label_type={String}&project_id={String}

description : _get total number of image set_

    return Integer

# Set Transition

**POST** /recompute

description : _recompute project's confidence score_

    body {
        String: project_id,
    }

    return {}

**POST** /autolabel

description : _autolabel images in query set with confidence higher than limit_

    body {
        String: project_id,
        Integer: limit,
    }

    return {}

**POST** /add_to_support

description : _ add images in project_id/labeled/type to project_id/labeled _

    body {
        String: project_id,
        {"auto", "manual"}: type
    }

    return {}
