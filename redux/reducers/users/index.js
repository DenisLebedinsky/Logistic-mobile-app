import { all, fork, put, takeLatest } from 'redux-saga/effects';
import api from '../../../api';

const GET_USERS = '@@users/GET_USERS';
const GET_USERS_SUCCESS = '@@users/GET_USERS_SUCCESS';
const GET_USERS_FAIL = '@@users/GET_USERS_FAIL';

const ADD_USER = '@@users/ADD_USER';
const ADD_USER_SUCCESS = '@@users/ADD_USER_SUCCESS';
const ADD_USER_FAIL = '@@users/ADD_USER_FAIL';

const UPDATE_USER = '@@users/UPDATE_USER';
const UPDATE_USER_SUCCESS = '@@users/UPDATE_USER_SUCCESS';
const UPDATE_USER_FAIL = '@@users/UPDATE_USER_FAIL';

const DELETE_USER = '@@users/DELETE_USER';
const DELETE_USER_SUCCESS = '@@users/DELETE_USER_SUCCESS';
const DELETE_USER_FAIL = '@@users/DELETE_USER_FAIL';

// reducers
const initialState = {
    loading: false,
    error: false,
    list: [],
    count: 0
};

export const reducer = (state = initialState, action ) => {
    const { type, payload } = action;

    switch (type) {
        case GET_USERS:
            return state;
        case GET_USERS_SUCCESS:
            return { ...state, list: payload.list, count: payload.count };
        case GET_USERS_FAIL:
            return { ...state, ...payload };
        default:
            return state;
    }
};

// selectors 
export const getUserFromState = (state) => state.users;

// actions creators
export const getUsers = (token, skip, limit) =>
    ({ type: GET_USERS, payload: { token, skip, limit } });

export const getUsersSuccess = (users) =>
    ({ type: GET_USERS_SUCCESS, payload: users });

export const getUsersFail = (err) =>
    ({ type: GET_USERS_FAIL, payload: { error: err } });

// add
export const addUser = (token, newUser) =>
    ({ type: ADD_USER, payload: { token, newUser } });

export const addUserSuccess = (newUser) =>
    ({ type: ADD_USER_SUCCESS, payload: newUser });

export const addUserFail = (error) =>
    ({ type: ADD_USER_FAIL, payload: error });

// update
export const updateUser = (token, editedUser) =>
    ({ type: UPDATE_USER, payload: { token, editedUser } });

export const updateUserSuccess = (updatedUser) =>
    ({ type: UPDATE_USER_SUCCESS, payload: updatedUser });

export const updateUserFail = (error) =>
    ({ type: UPDATE_USER_FAIL, payload: error });

// delete
export const deleteUser = (token, id) =>
    ({ type: DELETE_USER, payload: { token, id } });

export const deleteUserSuccess = (deletedLocation) =>
    ({ type: DELETE_USER_SUCCESS, payload: deletedLocation });

export const deleteUserFail = (error) =>
    ({ type: DELETE_USER_FAIL, payload: error });

    
// sagas 
export function* saga() {
    yield all([
        fork(watchGetUsersSaga),
        fork(watchAddUsersaga),
        fork(watchUpdateUsersaga),
        fork(watchDeleteUsersaga)
    ]);
}

function* watchGetUsersSaga() {
    yield takeLatest(GET_USERS, getUsersSaga);
}

function* watchAddUsersaga() {
    yield takeLatest(ADD_USER, addUserSaga);
}

function* watchUpdateUsersaga() {
    yield takeLatest(UPDATE_USER, updateUsersaga);
}

function* watchDeleteUsersaga() {
    yield takeLatest(DELETE_USER, deleteUsersaga);
}


function* getUsersSaga(action) {
    try {
        const { token, skip, limit } = action.payload;

        api.defaults.headers.common.Authorization = `Baerer ${token}`;

        const result = yield api.post('/users/', { skip, limit });

        if (!result) {
            throw new Error('error with get data');
        }

        yield put(getUsersSuccess(result.data));
    } catch (error) {
        yield put(getUsersFail(error));
    }
}

function* addUserSaga(action) {
    try {
        const { token, newUser } = action.payload;

        api.defaults.headers.common.Authorization = `Baerer ${token}`;

        const result = yield api.post('/users/create', newUser);

        if (!result) {
            throw new Error('error with get update');
        }

        yield put(addUserSuccess(result.data));
        yield put(getUsers(token, 0, 1000));
    } catch (error) {
        yield put(addUserFail(error));
    }
}

function* updateUsersaga(action) {
    try {
        const { token, editedUser } = action.payload;
        api.defaults.headers.common.Authorization = `Baerer ${token}`;

        const result = yield api.post('/users/update/', editedUser);

        if (!result) {
            throw new Error('error with get data');
        }

        yield put(updateUserSuccess(result.data));
        yield put(getUsers(token, 0, 1000));
    } catch (error) {
        yield put(updateUserFail(error));
    }
}

function* deleteUsersaga(action) {
    try {
        const { token, id } = action.payload;
        api.defaults.headers.common.Authorization = `Baerer ${token}`;

        const result = yield api.post('/users/delete', { id });

        if (!result) {
            throw new Error('error with get data');
        }

        yield put(deleteUserSuccess(result.data));
        yield put(getUsers(token, 0, 1000));
    } catch (error) {
        yield put(deleteUserFail(error));
    }
}

