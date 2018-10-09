/**
 * @file
 * Redux store configuration.
 * 
 * @author Riccardo Busetti
 */
import { createStore, applyMiddleware } from 'redux'
import reducers from '../reducers';
import { apiMiddleware } from 'redux-api-middleware';
import createSagaMiddleware from 'redux-saga'
import sagas from '../saga';

/**
 * Creates the store.
 * 
 * @return the store instance.
 */
export function configureStore() {
    const saga = createSagaMiddleware();
    const store = createStore(reducers, window.STATE_FROM_SERVER, applyMiddleware(apiMiddleware, saga));
    saga.run(sagas);
    
    return store;
}