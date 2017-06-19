import { combineReducers } from 'redux';
import memo from './memo';
import authentication from './authentication';

//import { penderReducer } from 'redux-pender';

export default combineReducers({
    memo, 
    authentication,
});