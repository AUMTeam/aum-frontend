import { all, put } from 'redux-saga/effects';
import { GLOBAL_ERROR_ACTION_TYPE } from '../actions/globalError';
import { authFlowSaga } from './auth';
import { listSagas } from './commonList';
import { technicalAreaManagerSagas } from './views/technicalAreaManager';

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
    yield all([authFlowSaga(), ...listSagas, ...technicalAreaManagerSagas]);
  } finally {
    // Since some of the functions passed to all() method never end (endless loop),
    // this finally block is reached only when there's an uncaught exception in a saga
    // (since all() is aborted when one of the passed functions/effects fails)
    yield put({ type: GLOBAL_ERROR_ACTION_TYPE.SAGA_ERROR });
  }
}
