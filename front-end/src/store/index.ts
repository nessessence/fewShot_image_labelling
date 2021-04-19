import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import { projectReducer } from './project/reducer';
import { ProjectState } from './project/types';
import { ImageState } from './image/types'
import { imageReducer } from './image/reducer';

export interface RootState {
    project: ProjectState,
    image: ImageState
}

const store = createStore<RootState, any, any, any>(
    combineReducers({
        project: projectReducer,
        image: imageReducer
    }),
    applyMiddleware(ReduxThunk)
);

export default store;