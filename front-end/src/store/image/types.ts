export type Image = {
    project_id: string,
    image_id: string,
    image_path: string,
    class_id: string,
    class_score: ImageScore | null,
    image_set: ImageSet,
    type: LabelType | null,
    preview_image_blob: string,
}

export type ImageScore = {
    [key: string]: number,
}

export enum ImageSet {
    SUPPORT = 'SUPPORT',
    QUERY = 'QUERY',
    LABELED = 'LABELED'
}

export enum LabelType {
    AUTO = 'AUTO',
    MANUAL = 'MANUAL'
}

export interface ImageState {
    queryImages: Image[]
}