import { combineReducers } from 'redux';
import { auth } from './auth';
import { user } from './user';
import { programmer } from './programmer';

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
 */

const reducers = combineReducers({
  auth,
  user,
  programmer
});

export default reducers;
