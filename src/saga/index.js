import { all } from 'redux-saga/effects';
import { userSaga } from './userSaga';
import { authFlowSaga } from './authSaga';

/**
 * @file
 * This file is the root of the saga implementation in the app.
 * We need to combine all the sagas related to a specific app part,
 * following the same hierarchy as the actions and reducers.
 */

export default function* rootSaga() {
  yield all([authFlowSaga(), ...userSaga]);
}
