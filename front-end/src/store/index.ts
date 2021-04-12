import { combineReducers, createStore } from 'redux';
import { projectReducer } from './project/reducer';
import { ProjectState } from './project/types';

export interface RootState {
    project: ProjectState
}

const store = createStore<RootState, any, any, any>(
    combineReducers({
        project: projectReducer
}));

export default store;