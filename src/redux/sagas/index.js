import { all } from 'redux-saga/effects';
import { authFlowSaga } from './auth';
import { commitsSaga } from './commits';
import { userSaga } from './user';

/**
 * @file
 * This file is the root of the Saga implementation in the app.
 * Saga allows us to perform side-effects in a separate thread in response to
 * the dispatch of a Redux action.
 * Here we combine all the sagas related to a specific app part,
 * following the same hierarchy as the actions and reducers.
 */

export default function* rootSaga() {
  yield all([authFlowSaga(), ...userSaga, ...commitsSaga]);
}
