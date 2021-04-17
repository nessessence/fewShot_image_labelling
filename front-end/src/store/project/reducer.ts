import { ProjectState } from './types'
import { DISCOVER_DATAROOT, STORE_PROJECTS } from './actions'

const initialState: ProjectState = {
    dataroot: [],
    currentProject: undefined,
    loadedProject: []
}

export function projectReducer(state: ProjectState = initialState, action: any): ProjectState {
    switch (action.type) {
        case DISCOVER_DATAROOT:
            return Object.assign({}, state, {
                dataroot: action.folderNames
            })
        case STORE_PROJECTS:
            return Object.assign({}, state, {
                loadedProject: action.projects
            })
        default:
            return state
    }
}