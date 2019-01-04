import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';

/**
 * @file
 * This file contains helper methods to create the redux store.
 * We bind together reducers, state and all the needed middlewares.
 */

export function configureStore() {
  const composeWithDevToolsIfPresent = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const saga = createSagaMiddleware();
  const store = createStore(
    reducers,
    composeWithDevToolsIfPresent(applyMiddleware(saga))
  );
  saga.run(rootSaga);

  return store;
}
