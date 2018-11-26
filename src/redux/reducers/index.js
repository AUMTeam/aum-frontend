import { combineReducers } from 'redux';
import { auth } from './auth';
import { programmer } from './programmer';
import { user } from './user';
import { globalError } from './globalError';

/**
 * @file
 * This file is the root of the reducers.
 * We need to combine all the various reducers functions into one,
 * thus having a better hierarchy of the state.
 * We can sum up the hierarchy as follows:
 * |-- auth
 * |-- user
 * |-- programmer
 * |   |-- commits
 * |   |-- sendRequests
 * |-- technicalAreaManager
 * |   |-- commits
 * |-- revisionOfficeManager
 * |   |-- sendRequests
 * |-- client
 * |   |-- ??? (TBD)
 * |-- globalError
 */

const reducers = combineReducers({
  auth,
  user,
  programmer,
  globalError
});

export default reducers;
