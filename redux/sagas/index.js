import { all, fork } from 'redux-saga/effects';

import {saga as authSaga } from '../reducers/auth';
import {saga as packagesSaga } from '../reducers/packages';
import {saga as locationsSaga } from '../reducers/locations';
import {saga as qrCodeSaga } from '../reducers/qrCode';
import {saga as usersSaga } from '../reducers/users';

function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(packagesSaga),
    fork(locationsSaga),
    fork(qrCodeSaga),
    fork(usersSaga)
  ]);
}

export default rootSaga;
