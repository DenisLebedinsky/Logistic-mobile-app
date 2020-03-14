import { all, fork, put, takeLatest, select, call } from "redux-saga/effects";
import api from "../../../api";
import { authSelector } from "../auth";
import toast from "../../../Utils/toast";

const GET_PACKAGE_BY_ID = "@@packages/GET_PACKAGE_BY_ID";
const GET_PACKAGE_BY_ID_SUCCESS = "@@packages/GET_PACKAGE_BY_ID_SUCCESS";
const GET_PACKAGE_BY_ID_FAIL = "@@packages/GET_PACKAGE_BY_ID_FAIL";

const CHANGE_UPDATE_ITEM = "@@packages/CHANGE_UPDATE_ITEM";
const SET_UPDATE_ITEM = "@@packages/SET_UPDATE_ITEM";

const UPDATE_PACKAGE = "@@packages/UPDATE_PACKAGE";
const UPDATE_PACKAGE_SUCCESS = "@@packages/UPDATE_PACKAGE_SUCCESS";
const UPDATE_PACKAGE_FAIL = "@@packages/UPDATE_PACKAGE_FAIL";

const START_SEND_PACKAGE = "@@packages/START_SEND_PACKAGE";
const SEND_FROM_TRANSIT = "@@packages/SEND_FROM_TRANSIT";
const ACCEPT_PACKAGE = "@@packages/ACCEPT_PACKAGE";

const UPDATE_DRIVER_DETAILS = "@@packages/UPDATE_DRIVER_DETAILS";

const initialState = {
  loading: true,
  updateLaoding: false,
  error: false,
  errorUpdate: false,
  package: null,
  updateItem: null
};

export const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PACKAGE_BY_ID:
      return { ...state, error: false, loading: true, updateItem: {} };
    case GET_PACKAGE_BY_ID_SUCCESS:
      return {
        ...state,
        package: payload,
        loading: false
      };
    case SET_UPDATE_ITEM:
      return { ...state, updateItem: payload };
    case GET_PACKAGE_BY_ID_FAIL:
      return { ...state, error: true, loading: false };
    case UPDATE_PACKAGE:
      return { ...state, errorUpdate: false, updateLaoding: true };
    case UPDATE_PACKAGE_SUCCESS:
      return {
        ...state,
        updateItem: {},
        errorUpdate: false,
        updateLaoding: false
      };
    case UPDATE_PACKAGE_FAIL:
      return { ...state, errorUpdate: true, updateLaoding: false };
    default:
      return state;
  }
};

//selectors
export const packageSelector = state => state.packages.package;
export const loadingSelector = state => state.packages.loading;
export const errorSelector = state => state.packages.error;
export const updateLaodingSelector = state => state.packages.updateLaoding;
export const errorUpdateSelector = state => state.packages.errorUpdate;
export const updateItemSelector = state => state.packages.updateItem;

//actions
export function getPackage(id) {
  return {
    type: GET_PACKAGE_BY_ID,
    payload: id
  };
}

function getPackageSuccess(data) {
  return {
    type: GET_PACKAGE_BY_ID_SUCCESS,
    payload: data
  };
}

function getPackageFail(data) {
  return {
    type: GET_PACKAGE_BY_ID_FAIL,
    payload: data
  };
}

export const changeUpdateItem = data => ({
  type: CHANGE_UPDATE_ITEM,
  payload: data
});

export const setUpdateItem = item => ({
  type: SET_UPDATE_ITEM,
  payload: item
});

export const updatePackage = navigation => ({
  type: UPDATE_PACKAGE,
  payload: navigation
});

export const updatePackageSuccess = updatedPackage => ({
  type: UPDATE_PACKAGE_SUCCESS,
  payload: updatedPackage
});

export const updatePackageFail = error => ({
  type: UPDATE_PACKAGE_FAIL,
  payload: error
});

// ------

// export function startSendPackage() {
//     return {
//         type: START_SEND_PACKAGE
//     }
// }

export function sendFromTransit(location) {
  return {
    type: SEND_FROM_TRANSIT,
    payload: location
  };
}

export function acceptPackage(comment, navigation) {
  return {
    type: ACCEPT_PACKAGE,
    payload: { comment, navigation }
  };
}

export function updateDriverDetails(details, navigation) {
  return {
    type: UPDATE_DRIVER_DETAILS,
    payload: { details, navigation }
  };
}

//--------

export function* saga() {
  yield all([
    yield takeLatest(GET_PACKAGE_BY_ID, getPackagesSaga),
    yield takeLatest(CHANGE_UPDATE_ITEM, changeUpdateItemSaga),
    yield takeLatest(UPDATE_PACKAGE, updatePackageSaga),
    yield takeLatest(START_SEND_PACKAGE, startSendPackageSaga),
    yield takeLatest(SEND_FROM_TRANSIT, sendFromTransitSaga),
    yield takeLatest(ACCEPT_PACKAGE, acceptPackageSaga),
    yield takeLatest(UPDATE_DRIVER_DETAILS, updateDriverDetailsSaga)
  ]);
}

function* changeUpdateItemSaga({ payload }) {
  const updateItem = Object.assign({}, yield select(updateItemSelector));
  yield put(setUpdateItem({ ...updateItem, ...payload }));
}

function* getPackagesSaga({ payload }) {
  const {
    user: { token }
  } = yield select(authSelector);

  try {
    api.defaults.headers.Authorization = `Baerer ${token}`;

    const result = yield api.post("package/byid", { id: payload });

    yield put(getPackageSuccess(result.data));
  } catch (error) {
    toast("Ошибка загрузки Отправления");
    yield put(getPackageFail(error.response));
  }
}

function* updatePackageSaga({ payload }) {
  // payload = navigation from router
  const updatedPackage = yield select(updateItemSelector);

  const {
    user: { token }
  } = yield select(authSelector);
  try {
    api.defaults.headers.Authorization = `Baerer ${token}`;

    const result = yield api.post("package/update", updatedPackage);

    yield put(updatePackageSuccess(result.data));
    payload.navigate("ShowStatus");
  } catch (error) {
    const params = JSON.stringify(updatedPackage);

    toast(`params: ${params}
status: ${error.response.status}
statustext: ${error.response.statusText}`);
    yield put(updatePackageFail(error.response));
  }
}

function* updateDriverDetailsSaga({ payload: { details, navigation } }) {
  yield put(changeUpdateItem(details));
  yield put(updatePackage(navigation));
}

function* startSendPackageSaga() { }

function* sendFromTransitSaga({ payload }) {
  const item = yield select(packageSelector);
  const auth = yield select(authSelector);
  const user = auth.user;

  let dateNow = Date.now();
  const transitlength = item.transit.length;

  if (transitlength > 0 && !item.transit[transitlength - 1].date) {
    item.transit[transitlength - 1].date = dateNow;
    item.transit[transitlength - 1].sendfactLocId = user.locationId;
    item.transit[transitlength - 1].userId = user.id;
  } else {
    item.transit.push({
      sendLocId: { title: payload },
      date: dateNow,
      sendfactLocId: user.locationId,
      userId: user.id
    })
  }

  if (transitlength === 0) {
    item.transit = [{ sendfactLocId: user.locationId }]
  }


  if (
    !(
      item.resiverId._id === payload ||
      item.resiverId.title.toLowerCase() === payload.toLowerCase()
    )
  ) {

    item.transit.push({
      sendLocId: { title: payload }
    });
  }

  const data = {
    _id: item._id,
    transit: item.transit,
    test: item.resiverId,
    status: "передано в доставку"
  };

  yield put(setUpdateItem(data));
}

function* acceptPackageSaga({ payload }) {
  const { user } = yield select(authSelector);

  const item = yield select(packageSelector);

  const isTransit = user.locationId !== item.resiverId._id;
  const status = isTransit ? "Принято на транзитном складе" : "доставлено";

  const data = {
    _id: item._id,
    status: status,
    recipientId: user.id,
    factresiverId: user.locationId,
    resiveData: Date.now(),
    comment: payload.comment
  };

  if (isTransit) {

    if (item.transit?.length) {
      const transit = item.transit.slice();
      const lastTransit = transit[transit.length - 1];

      if (!lastTransit.sendfactLocId) {
        transit[transit.length - 1].sendfactLocId = user.locationId;
        data.transit = transit;
      } else {
        transit.push({ sendfactLocId: user.locationId });
        data.transit = transit;
      }
    } else {
      data.transit = [{ sendfactLocId: user.locationId }];
    }
  }

  yield put(changeUpdateItem(data));
  yield put(updatePackage(payload.navigation));
}
