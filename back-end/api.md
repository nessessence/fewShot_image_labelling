# Projects

**GET** /projects
description : _get every project info_

    return array of {
        String: name,
        String[]: images_path,
        String[]: classes_name,
        Integer: labeled_class_count,
    }

**GET** /projects?project*id={String}
description : \_get project info*

    return {
        String: name,
        String[]: images_path,
        String[]: classes_name,
        Integer: labeled_class_count,
    }

**POST** /projects
description : _create new project_

    body {
    	String: project_path
    }

    return {}

**GET** /projects/query?page={Integer}&project*id={String}
description : \_get query page data*

    return {
        String[]: preview_image_path,
        String[]: images_id
    }

**GET** /projects/labeled?page={Integer}&project*id={String}&type={"auto", "manual"}
description : \_get labeled page data by mode*

    return {
        String[]: preview_image_path,
        String[]: images_id
    }

# Image

**GET** /image?image*id={String}
description : \_get image data*

    return {
        String[]: class_name_list,
        String[]: class_id_list,
        String[]: class_score_list,
        String: current_class,
        String: image_path
    }

**POST** /image
description : _manually label an image, edit image current class_

    body {
        String: image_id,
        String: class_id
    }

    return {}

# Set Transition

**POST** /recompute
description : _get recompute status (done/computing)_

    return {
        Boolean: done
    }

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

**POST** /add*to_support
description : \_add images in project_id/labeled/type to project_id/labeled*

    body {
        String: project_id,
        {"auto", "manual"}: type
    }

    return {}
