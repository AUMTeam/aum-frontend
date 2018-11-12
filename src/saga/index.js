import { all } from 'redux-saga/effects';
import { userSaga } from './userSaga';
import { authFlowSaga } from './authSaga';
import { commitsSaga } from './commitsSaga';

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
