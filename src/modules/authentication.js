import { handleActions, createAction } from 'redux-actions';

import axios from 'axios';
import update from 'react-addons-update';

const AUTH_LOGIN = 'AUTH_LOGIN';
const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
const AUTH_REGISTER = 'AUTH_REGISTER';
const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
const AUTH_REGISTER_FAILURE = 'AUTH_REGISTER_FAILURE';
const AUTH_GET_STATUS = 'AUTH_GET_STATUS';
const AUTH_GET_STATUS_SUCCESS = 'AUTH_GET_STATUS_SUCCESS';
const AUTH_GET_STATUS_FAILURE = 'AUTH_GET_STATUS_FAILURE';
const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const login = createAction(AUTH_LOGIN);
export const loginSuccess = createAction(AUTH_LOGIN_SUCCESS); // username
export const loginFailure = createAction(AUTH_LOGIN_FAILURE);

/*LOGIN*/
export const loginRequest = (username, password) => dispatch => {
    // 요청 시작을 알림!
    dispatch(login());

    return axios.post('/api/account/signin', { username, password})
    .then(
        (response) => {
      //SUCCEED
      dispatch(loginSuccess(username));
    }).catch((error) => {
      dispatch(loginFailure());
    });
};

/* REGISTER */
export const register = createAction(AUTH_REGISTER);
export const registerSuccess = createAction(AUTH_REGISTER_SUCCESS); // username, password, email
export const registerFailure = createAction(AUTH_REGISTER_FAILURE); // error

export const registerRequest = (username, password, email) => dispatch => {
    // Inform Register API is starting
    dispatch(register());

    return axios.post('/api/account/signup', { username, password, email })
    .then((response) => {
        dispatch(registerSuccess());
    }).catch((error) => {
        dispatch(registerFailure(error.response.data.code));
    });
};

/* GET STATUS */
export const getStatus = createAction(AUTH_GET_STATUS); 
export const getStatusSuccess = createAction(AUTH_GET_STATUS_SUCCESS); // username
export const getStatusFailure = createAction(AUTH_GET_STATUS_FAILURE);

export const getStatusRequest = () => dispatch => {
    // inform Get Status API is starting
    dispatch(getStatus());

    return axios.get('/api/account/getInfo')
    .then((response) => {
        dispatch(getStatusSuccess(response.data.info.username));
    }).catch((error) => {
        dispatch(getStatusFailure());
    });
}

/* Logout */
export const logout = createAction(AUTH_LOGOUT);

export const logoutRequest = () => dispatch => {
    return axios.post('/api/account/logout')
    .then((response) => {
        dispatch(logout());
    });
}

const initialState = {
  login: {
    status: 'INIT'
  },
  register: {
    status: 'INIT',
    error: -1
  },
  status: {
    valid: false,
    isLoggedIn: false,
    currentUser: ''
  }
}

export default handleActions({
    [AUTH_LOGIN]: (state, action) => {
        return update(state, {
          login: {
            status: { $set: 'WAITING' }
          }
        });
    },
    [AUTH_LOGIN_SUCCESS]: (state, action) => {
        return update(state, {
          login: {
            status: { $set: 'SUCCESS' }
          },
          status: {
            isLoggedIn: { $set: true },
            currentUser: { $set: action.payload }
          }
        });
    },
     [AUTH_LOGIN_FAILURE]: (state, action) => {
        return update(state, {
          login: {
            status: { $set: 'FAILURE' }
          }
        });
    },
     [AUTH_REGISTER]: (state, action) => {
        return update(state, {
              register: {
                  status: { $set: 'WAITING' },
                  error: { $set: -1 }
              }
          });
    },
     [AUTH_REGISTER_SUCCESS]: (state, action) => {
        return update(state, {
              register: {
                  status: { $set: 'SUCCESS' }
              }
          });
    },
     [AUTH_REGISTER_FAILURE]: (state, action) => {
        return update(state, {
              register: {
                  status: { $set: 'FAILURE' },
                  error: { $set: action.payload }
              }
          });
    },
     [AUTH_GET_STATUS]: (state, action) => {
        return update(state, {
              status: {
                  isLoggedIn: { $set: true }
              }
          });
    },
     [AUTH_GET_STATUS_SUCCESS]: (state, action) => {
         return update(state, {
              status: {
                  valid: { $set: true },
                  currentUser: { $set: action.payload }
              }
          });
    },
     [AUTH_GET_STATUS_FAILURE]: (state, action) => {
        return update(state, {
              status: {
                  isLoggedIn: { $set: false },
                  currentUser: { $set: '' }
              }
          });
    },

}, initialState);