import { combineReducers } from 'redux';
import { auth } from './auth';
import { globalError } from './globalError';
import { generateViewReducers } from './views';
import { user } from './user';
import { USER_TYPE_ID } from '../../constants/user';

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
 * User view-specific reducers are generated dynamically (see views.js for details).
 */

const reducers = combineReducers({
  auth,
  user,
  ...generateViewReducers([USER_TYPE_ID.PROGRAMMER, USER_TYPE_ID.TECHNICAL_AREA_MANAGER]),
  globalError
});

export default reducers;
