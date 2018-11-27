import { all, put } from 'redux-saga/effects';
import { authFlowSaga } from './auth';
import { commitsSaga } from './commits';
import { userSaga } from './user';
import { GLOBAL_ERROR_ACTION_TYPE_KEYS } from '../actions/globalError';

/**
 * @file
 * This file is the root of the Saga implementation in the app.
 * Saga allows us to perform side-effects in a separate thread in response to
 * the dispatch of a Redux action.
 * Here we combine all the sagas related to a specific app part,
 * following the same hierarchy as the actions and reducers.
 */

export default function* rootSaga() {
  try {
    yield all([authFlowSaga(), ...userSaga, ...commitsSaga]);
  }
  // Since some of the functions passed to all() method never end (endless loop),
  // this finally block is reached only when there's an uncaught exception in a saga
  // (since all() is aborted when one of the passed functions/effects fails)
  finally {
    yield put({ type: GLOBAL_ERROR_ACTION_TYPE_KEYS.SAGA_ERROR });
  }
}
