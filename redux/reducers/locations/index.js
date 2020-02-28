import { put, takeLatest, all, fork, select } from 'redux-saga/effects';
import api from '../../../api';
import { authSelector } from '../auth'
import toast from '../../../Utils/toast';

const GET_LOCATIONS = '@@LOCATIONS/GET_LOCATIONS';
const GET_LOCATIONS_SUCCESS = '@@LOCATIONS/GET_LOCATIONS_SUCCESS';
const GET_LOCATIONS_FAIL = '@@LOCATIONS/GET_LOCATIONS_FAIL';

const initialState = {
  loading: false,
  error: false,
  list: [],
  count: 0
};

export const reducer = (
  state = initialState,
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case GET_LOCATIONS:
      return { ...state, error: true, loading: true };
    case GET_LOCATIONS_SUCCESS:
      return {
        loading: false,
        error: false,
        list: payload.list,
        count: payload.count
      };
    case GET_LOCATIONS_FAIL:
      return { ...state, error: true };

    default:
      return state;
  }
};

//selectors 
export const locationsSelector = (state) => state.locations;

// action creators
export const getLocations = () =>
  ({ type: GET_LOCATIONS });

export const getLocationsSuccess = (locations) =>
  ({ type: GET_LOCATIONS_SUCCESS, payload: locations });

export const getLocationsFail = (error) =>
  ({ type: GET_LOCATIONS_FAIL, payload: error });



// main
export function* saga() {
  yield all([
    fork(watchGetLocationsSaga)
  ]);
}


// watchers
function* watchGetLocationsSaga() {
  yield takeLatest(GET_LOCATIONS, getLocationsSaga);
}

function* getLocationsSaga(action) {
  const { user: { token } } = yield select(authSelector)
  try {
    api.defaults.headers.common.Authorization = `Baerer ${token}`;
  
    const result = yield api.post('/locations/', { skip: 0, limit: 10000 });

    if (!result) {
      toast('Ошибка загрузки локаций')
      throw new Error('Ошибка загрузки локаций');
    }

    yield put(getLocationsSuccess(result.data));
  } catch (error) {
    toast('Ошибка загрузки локаций')
    yield put(getLocationsFail(error));
  }
}


