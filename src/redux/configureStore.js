import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';  
import reducers from './reducers';
import rootSaga from './sagas';
import { withSnackbar } from 'notistack';
import { Provider } from 'react-redux';
import { createNotistackMiddleware } from './notistackMiddleware';

/**
 * @file
 * This file contains helper methods to create the Redux store.
 * We bind together reducers, state and all the needed middlewares.
 */

function configureStore(notistackCallback) {
  const composeWithDevToolsIfPresent = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const saga = createSagaMiddleware();
  const notistack = createNotistackMiddleware(notistackCallback);
  const store = createStore(
    reducers,
    composeWithDevToolsIfPresent(applyMiddleware(saga, notistack))
  );
  saga.run(rootSaga);

  return store;
}

/**
 * This component wraps the Redux store provider in a withSnackbar() HOC so that the configureStore
 * function can get notistack's enqueueSnackbar function (needed for our custom middleware).
 */
function EnhancedStoreProvider(props) {
  return (
    <Provider store={configureStore(props.enqueueSnackbar)}>
      {props.children}
    </Provider>
  )
}

export default withSnackbar(EnhancedStoreProvider);