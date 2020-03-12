import { all, fork, put, takeLatest } from 'redux-saga/effects';
import api from '../../../api';

const GET_QR_CODE = '@@qrCode/GET_QR_CODE';
const GET_QR_CODE_SUCCESS = '@@qrCode/GET_QR_CODE_SUCCESS';
const GET_QR_CODE_FAIL = '@@qrCode/GET_QR_CODE_FAIL';
const CLEAR_QR_CODE = '@@qrCode/CLEAR_QR_CODE';

// reducer
const initialState = {
  error: false,
  loading: true,
  qr: ''
};

export const reducer = (
  state = initialState,
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case GET_QR_CODE:
      return { ...state, error: true, loading: true };
    case GET_QR_CODE_SUCCESS:
      return { loading: false, error: false, qr: payload.qr };
    case GET_QR_CODE_FAIL:
      return { ...state, error: true };
    case CLEAR_QR_CODE:
      return { ...initialState };
    default:
      return state;
  }
};

// selector
export const qrCodeFromState = (state) => state.qrCode.qr;

// AC
export const getQRCode = (token, id) =>
  ({ type: GET_QR_CODE, payload: { token, id } });

export const getQRCodeSuccess = (qrCode) =>
  ({ type: GET_QR_CODE_SUCCESS, payload: qrCode });

export const getQRCodeFail = (error) =>
  ({ type: GET_QR_CODE_FAIL, payload: error });

export const clearQRcode = () => ({ type: CLEAR_QR_CODE });


// sagas
export function* saga() {
  yield all([fork(watchGetQRCodeSaga)]);
}

function* watchGetQRCodeSaga() {
  yield takeLatest(GET_QR_CODE, getQRCodeSaga);
}

function* getQRCodeSaga(action) {
  try {    
    const { token, id } = action.payload;

    api.defaults.headers.common.Authorization = `Baerer ${token}`;

    const result = yield api.post('/package/getBarcode', { id });
    
    if (!result) {
      throw new Error('error with get data');
    }
    yield put(getQRCodeSuccess({ qr: result.data }));
  } catch (error) {
    yield put(getQRCodeFail(error));
  }
}
