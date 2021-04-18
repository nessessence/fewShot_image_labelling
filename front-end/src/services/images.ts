import axios from 'axios'

import { LabelType, ImageSet, Image } from '../store/image/types'

const ENDPOINT = 'http://localhost:5001'

const countImageSet = async (
    imageSet: ImageSet,
    projectId: string,
    labelType: LabelType | null
) => {
    let queryString = `${ENDPOINT}/count?image_set=${imageSet}&project_id=${projectId}`
    if (labelType) {
        queryString = `${queryString}&label_type=${labelType}`
    }
    const response = await axios.get(queryString)
    const count = response.data
    return count
}

const getQueryImage = async (
    pageSize: number,
    page: number,
    projectId: string
) => {
    const response = await axios.get(`${ENDPOINT}/projects/query?page_size=${pageSize}&page=${page}&project_id=${projectId}`)
    const queryImages: Image[] = response.data
    return queryImages
}

const getImage = async (imageId: string) => {
    const response = await axios.get(`${ENDPOINT}/images?image_id=${imageId}`)
    const image: Image = response.data
    return image
}

const getLabeledImage = async (
    pageSize: number,
    page: number,
    projectId: string,
    labelType: LabelType
) => {
    const response = await axios.get(`${ENDPOINT}/projects/labeled?page_size=${pageSize}&page=${page}&project_id=${projectId}&type=${labelType}`)
    const labeledImages: Image[] = response.data
    return labeledImages
}

export {
    countImageSet,
    getQueryImage,
    getImage,
    getLabeledImage
}