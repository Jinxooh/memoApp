import { handleActions, createAction } from 'redux-actions';

import axios from 'axios';
import update from 'react-addons-update';

/* MEMO */
 const MEMO_POST = "MEMO_POST";
 const MEMO_POST_SUCCESS = "MEMO_POST_SUCCESS";
 const MEMO_POST_FAILURE = "MEMO_POST_FAILURE";

 const MEMO_LIST = "MEMO_LIST";
 const MEMO_LIST_SUCCESS = "MEMO_LIST_SUCCESS";
 const MEMO_LIST_FAILURE = "MEMO_LIST_FAILURE";

 const MEMO_EDIT = "MEMO_EDIT";
 const MEMO_EDIT_SUCCESS = "MEMO_EDIT_SUCCESS";
 const MEMO_EDIT_FAILURE = "MEMO_EDIT_FAILURE";

 const MEMO_REMOVE = "MEMO_REMOVE";
 const MEMO_REMOVE_SUCCESS = "MEMO_REMOVE_SUCCESS";
 const MEMO_REMOVE_FAILURE = "MEMO_REMOVE_FAILURE";

 const MEMO_STAR = "MEMO_STAR";
 const MEMO_STAR_SUCCESS = "MEMO_STAR_SUCCESS";
 const MEMO_STAR_FAILURE = "MEMO_STAR_FAILURE";

export const memoPost = createAction(MEMO_POST);
export const memoPostSuccess = createAction(MEMO_POST_SUCCESS);
export const memoPostFailure = createAction(MEMO_POST_FAILURE); // error

/* MEMO POST */
export const memoPostRequest = (contents) => dispatch => {
    // inform MEMO POST API is starting
    dispatch(memoPost());

    return axios.post('/api/memo/', { contents })
    .then((response) => {
        dispatch(memoPostSuccess());
    }).catch((error) => {
        dispatch(memoPostFailure(error.response.data.code));
    });
}

/* MEMO LIST */
export const memoList = createAction(MEMO_LIST);
export const memoListSuccess = createAction(MEMO_LIST_SUCCESS);
export const memoListFailure = createAction(MEMO_LIST_FAILURE);

/*
    Parameter:
        - isInitial: whether it is for initial loading
        - listType:  OPTIONAL; loading 'old' memo or 'new' memo
        - id:        OPTIONAL; memo id (one at the bottom or one at the top)
        - username:  OPTIONAL; find memos of following user
*/
export const memoListRequest = (isInitial, listType, id, username) => dispatch => {
    // inform memo list API is starting
    dispatch(memoList());

    let url = '/api/memo';

    if(typeof username === "undefined") {
        // username not given, load public memo
        url = isInitial ? url : `${url}/${listType}/${id}`;
        // or url + '/' + listType + '/' +  id
    } else {
        // load memos of a user
        url = isInitial ? `${url}/${username}` : `${url}/${username}/${listType}/${id}`;
    }

    return axios.get(url)
    .then((response) => {
        dispatch(memoListSuccess(response.data, isInitial, listType));
    }).catch((error) => {
        dispatch(memoListFailure());
    });
}

/* MEMO EDIT */
export const memoEdit = createAction(MEMO_EDIT);
export const memoEditSuccess = createAction(MEMO_EDIT_SUCCESS);
export const memoEditFailure = createAction(MEMO_EDIT_FAILURE);

export const memoEditRequest = (id, index, contents) => dispatch => {
    dispatch(memoEdit());

    return axios.put('/api/memo/' + id, { contents })
    .then((response) => {
        dispatch(memoEditSuccess(index, response.data.memo));
    }).catch((error) => {
        dispatch(memoEditFailure(error.response.data.code));
    });
};

/* MEMO REMOVE */
export const memoRemove = createAction(MEMO_REMOVE);
export const memoRemoveSuccess = createAction(MEMO_REMOVE_SUCCESS);
export const memoRemoveFailure = createAction(MEMO_REMOVE_FAILURE);

export const memoRemoveRequest = (id, index) => dispatch => {
    dispatch(memoRemove());

    return axios.delete('/api/memo/' + id)
    .then((response) => {
        dispatch(memoRemoveSuccess(index));
    }).catch((error) => {
        dispatch(memoRemoveFailure(error.response.data.code));
    });
}

/* MEMO TOGGLE STAR */
export const memoStar = createAction(MEMO_STAR);
export const memoStarSuccess = createAction(MEMO_STAR_SUCCESS);
export const memoStarFailure = createAction(MEMO_STAR_FAILURE);

export const memoStarRequest = (id, index) => dispatch => {
    return axios.post('/api/memo/star/' + id)
    .then((response) => {
        dispatch(memoStarSuccess(index, response.data.memo));
    }).catch((error) => {
        dispatch(memoStarFailure(error.response.data.code));
    });
};

const initialState = {
    post: {
        status: 'INIT',
        error: -1
    },
    list: {
        status: 'INIT',
        data: [],
        isLast: false
    },
    edit: {
       status: 'INIT',
       error: -1,
   },
   remove: {
        status: 'INIT',
        error: -1
    },
    star: {
        status: 'INIT',
        error: -1
    }
};

export default handleActions({
    [MEMO_POST]: (state, action) => {
       return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
    },
    [MEMO_POST_SUCCESS]: (state, action) => {
        return update(state, {
                post: {
                    status: { $set: 'SUCCESS' }
                }
            });
    },
     [MEMO_POST_FAILURE]: (state, action) => {
        return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.payload }
                }
            });
    },
     [MEMO_LIST]: (state, action) => {
        return update(state, {
                list: {
                    status: { $set: 'WAITING' },
                }
            });
    },
     [MEMO_LIST_SUCCESS]: (state, action) => {
         if(action.payload.isInitial) {
                return update(state, {
                    list: {
                        status: { $set: 'SUCCESS' },
                        data: { $set: action.payload },
                        isLast: { $set: action.payload.length < 6 }
                    }
                })
            }else {
                if(action.payload.listType === 'new') {
                    return update(state, {
                        list: {
                            status: { $set: 'SUCCESS' },
                            data: { $unshift: action.payload },
                        }
                    });
                } else {
                    return update(state, {
                        list: {
                            status: { $set: 'SUCCESS' },
                            data: { $push: action.payload },
                            isLast: { $set: action.payload.length < 6 }
                        }
                    });
                }
            }
    },
     [MEMO_LIST_FAILURE]: (state, action) => {
         return update(state, {
                list: {
                    status: { $set: 'FAILURE' }
                }
            });
    },
    [MEMO_EDIT]: (state, action) => {
        return update(state, {
                edit: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 },
                    memo: { $set: undefined }
                }
            });
    },
     [MEMO_EDIT_SUCCESS]: (state, action) => {
        return update(state, {
                edit: {
                    status: { $set: 'SUCCESS' },
                },
                list: {
                    data: {
                        [action.payload.index]: { $set: action.payload.memo }
                    }
                }
            });
    },
     [MEMO_EDIT_FAILURE]: (state, action) => {
         return update(state, {
                edit: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.payload }
                }
            });
    },
     [MEMO_REMOVE]: (state, action) => {
        return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
    },
    [MEMO_REMOVE_SUCCESS]: (state, action) => {
        return update(state, {
                remove:{
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: { $splice: [[action.payload, 1]] }
                }
            });
    },
    [MEMO_REMOVE_FAILURE]: (state, action) => {
        return update(state, {
                remove: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.payload }
                }
            });
    },
    [MEMO_STAR]: (state, action) => {
        return update(state, {
                star: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
    },
    [MEMO_STAR_SUCCESS]: (state, action) => {
        console.log('!!!! -', action);
        return update(state, {
                star: {
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: {
                        [action.payload.index]: { $set: action.payload.memo }
                    }
                }
            });
    },
    [MEMO_STAR_FAILURE]: (state, action) => {
        return update(state, {
                star: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.payload }
                }
            });
    },
}, initialState);