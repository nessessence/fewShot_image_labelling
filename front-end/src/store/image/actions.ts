import { getQueryImage } from "../../services/images"

export const LOAD_QUERY_IMAGE = 'LOAD_QUERY_IMAGE'
export const REMOVE_QUERY_IMAGE = 'REMOVE_QUERY_IMAGE'

export const loadQueryImage = (
    pageSize: number,
    page: number,
    projectId: string
) => {
    return async (dispatch: any) => {
        const queryImages = await getQueryImage(pageSize, page, projectId)
        dispatch({
            type: LOAD_QUERY_IMAGE,
            queryImages: queryImages
        })
    }
}

export const removeQueryImage = (
    imageId: string
) => {
    return (dispatch: any) => {
        dispatch({
            type: LOAD_QUERY_IMAGE,
            imageId: imageId
        })
    }
}