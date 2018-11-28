import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';

/**
 * @file
 * This file contains helper methods to create the redux store.
 * We bind together reducers, state and all the needed middlewares.
 */

export function configureStore() {
  const saga = createSagaMiddleware();
  const store = createStore(reducers, window.STATE_FROM_SERVER, applyMiddleware(saga));
  saga.run(rootSaga);

  return store;
}
