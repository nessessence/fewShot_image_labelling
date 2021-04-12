export interface ProjectState {
    dataroot: string[],
    currentProject?: Project,
    loadedProject: Project[] 
}

export interface Project {
    name: String,
    projectId: String,
    imageClasses: ImageClass[],
    projectPath: String,
    unlabeledImageCount: Number
}

interface ImageClass {
    className: String,
    classId: String
}