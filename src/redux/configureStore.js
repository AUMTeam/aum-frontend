import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';
import { withSnackbar } from 'notistack';
import { Provider } from 'react-redux';

/**
 * @file
 * This file contains helper methods to create the redux store.
 * We bind together reducers, state and all the needed middlewares.
 */

function configureStore(notistackCallback) {
  const composeWithDevToolsIfPresent = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const saga = createSagaMiddleware();
  const store = createStore(
    reducers,
    composeWithDevToolsIfPresent(applyMiddleware(saga))
  );
  saga.run(rootSaga);

  return store;
}

function ReduxStoreProvider(props) {
  return (
    <Provider store={configureStore(props.enqueueSnackbar)}>
      {props.children}
    </Provider>
  )
}

export default withSnackbar(ReduxStoreProvider);