import { createStore, applyMiddleware } from 'redux';
import reducers from './modules';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

const logger = createLogger(); 

const store = createStore(reducers, applyMiddleware(logger, thunk));

export default store;
