import { ImageState } from './types'
import { LOAD_QUERY_IMAGE, REMOVE_QUERY_IMAGE } from './actions'

const initialState: ImageState = {
    queryImages: []
}

export function imageReducer(state: ImageState = initialState, action: any): ImageState {
    switch (action.type) {
        case LOAD_QUERY_IMAGE:
            return Object.assign({}, state, {
                queryImages: action.queryImages
            })
        case REMOVE_QUERY_IMAGE:
            return Object.assign({}, state, {
                queryImages: state.queryImages.filter(image => (
                    image.image_id !== action.imageId
                ))
            })
        default:
            return state
    }
}