import { combineReducers } from 'redux';
import { auth } from './auth';
import { user } from './user';
import { commits } from './commits';

/**
 * @file
 * This file is the root of the reducers.
 * We need to combine all the various reducers functions into one,
 * thus having a better hierarchy of the state.
 */

const reducers = combineReducers({
  auth,
  user,
  commits
});

export default reducers;
