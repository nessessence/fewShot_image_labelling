import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import { projectReducer } from './project/reducer';
import { ProjectState } from './project/types';

export interface RootState {
    project: ProjectState
}

const store = createStore<RootState, any, any, any>(
    combineReducers({
        project: projectReducer
    }),
    applyMiddleware(ReduxThunk)
);

export default store;