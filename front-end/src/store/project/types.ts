export interface ProjectState {
    dataroot: string[],
    currentProject?: Project,
    loadedProject: Project[] 
}

export interface Project {
    name: string,
    project_id: string,
    image_classes: ImageClass[],
    project_path: string,
    unlabeled_image_count: number
}

interface ImageClass {
    class_name: string,
    class_id: string,
    preview?: string[]
}