import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { closeSplash } from './actions';

export const isSplashOpen = createReducer(true as boolean).handleAction(
    closeSplash,
    (state, action) => false
);

const homeReducer = combineReducers({
    isSplashOpen,
});

export default homeReducer;
export type HomeState = ReturnType<typeof homeReducer>;
