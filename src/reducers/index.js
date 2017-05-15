import authentication from './authentication';
import memo from './memo';

import { combineReducers } from 'redux';

const reducers = combineReducers({
  authentication,
  memo
});

export default reducers;
