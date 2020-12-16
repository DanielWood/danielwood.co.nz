import { combineReducers } from 'redux';
import { homeReducer } from '@/app/home/redux';

export default combineReducers({
    home: homeReducer,
});
