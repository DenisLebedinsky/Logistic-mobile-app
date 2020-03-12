import { combineReducers } from 'redux';

import {reducer as auth} from './auth';
import {reducer as packages} from './packages';
import {reducer as qrCode} from './qrCode';
import {reducer as users} from './users';
import {reducer as locations} from './locations';

export default combineReducers({
  auth,
  packages,
  qrCode,
  users,
  locations
});
