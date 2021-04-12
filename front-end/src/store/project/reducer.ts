import {ProjectState} from './types'

const initialState: ProjectState = {
    dataroot: [],
    currentProject: undefined,
    loadedProject: []
}

export function projectReducer(state: ProjectState = initialState, action: any): ProjectState {
    switch (action.type) {
        default:
            return state
    }
}