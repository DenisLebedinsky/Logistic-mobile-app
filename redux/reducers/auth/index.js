import { put, takeLatest, all, fork, spawn } from 'redux-saga/effects';
import {
  AsyncStorage
} from "react-native";
import api from '../../../api';

const LOG_IN = '@@auth/LOG_IN';
const LOG_IN_SUCCESS = '@@auth/LOG_IN_SUCCESS';
const LOG_IN_FAIL = '@@auth/LOG_IN_FAIL';
const LOG_OUT = '@@auth/LOG_OUT';

const GET_USER_INFO = "@@auth/GET_USER_INFO";
const GET_USER_INFO_SUCCESS = "@@auth/GET_USER_INFO_SUCCESS";
const GET_USER_INFO_FAIL = "@@auth/GET_USER_INFO_FAIL";



const initialState = {
  loading: false,
  user: {
    username: '',
    token: '',
    role: '',
    locationId: '',
    id: ''
  },
  error: false
};

// reducer
export const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOG_IN:
      return state;
    case LOG_IN_SUCCESS:
      return { ...state, user:payload };
    case LOG_IN_FAIL:
      return { ...state, error: true };
    case LOG_OUT:
      return {
        loading: false,
        user: {
          username: '',
          token: '',
          role: '',
          locationId: '',
          id: ''
        },
        error: false
      };
    case GET_USER_INFO:
      return state;
    case GET_USER_INFO_SUCCESS:
      return { ...state, user: payload };
    case GET_USER_INFO_FAIL:
      return { ...state, error: true };
    default:
      return state;
  }
};

// selectors
export const authSelector = (state) => state.auth;

// Action creators
export const loginStart = authData => ({ type: LOG_IN, payload: authData });

export const loginSuccess = successData =>
  ({ type: LOG_IN_SUCCESS, payload: successData });

export const loginFail = error =>
  ({ type: LOG_IN_FAIL, payload: { error } });

export const logout = () => ({ type: LOG_OUT });

export const getUserInfo = token => ({ type: GET_USER_INFO, payload: token });

export const getUserInfoSuccess = successData => ({ type: GET_USER_INFO_SUCCESS, payload: successData });

export const getUserInfoFail = (error) =>
  ({ type: GET_USER_INFO_FAIL, payload: { error } });

//  Sagsas
export function* saga() {
  yield all([fork(watchLoginSaga)]);

}

// wathers
function* watchLoginSaga() {
  yield takeLatest(LOG_IN, loginSaga);
  yield takeLatest(LOG_OUT, logoutSaga);
  yield takeLatest(GET_USER_INFO, userInfoSaga);
}


function* loginSaga({ payload }) {
  try {
    const result = yield api.post('/users/login', payload);

    if (!result) {
      throw new Error('Forbidden');
    }

    const successData = {
      loading: false,
      user: {
        username: result.data.username,
        token: result.data.token,
        role: result.data.role,
        locationId: result.data.locationId,
        id: result.data.id
      },
      error: false
    };

    yield spawn(setUserToAsyncStorageSaga, result.data)
    yield put(loginSuccess(successData));
  } catch (e) {
    yield put(loginFail(e.message));
  }
}

function* logoutSaga(action) {
  yield AsyncStorage.clear();
}

function* setUserToAsyncStorageSaga(user) {
  yield AsyncStorage.setItem('user', JSON.stringify(user))

}

function* userInfoSaga(action) {
  try {
    api.defaults.headers.common.Authorization = `Baerer ${action.payload}`;

    const result = yield api.post('/users/getByToken');

    if (!result) {
      throw new Error('Forbidden');
    }

    const successData = { ...result.data, token: action.payload };

    yield put(getUserInfoSuccess(successData));
  } catch (e) {
    yield put(getUserInfoFail(e.message));
  }
}
