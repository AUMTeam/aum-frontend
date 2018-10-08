/**
 * @file
 * Redux store configuration.
 * 
 * @author Riccardo Busetti
 */

import { createStore, applyMiddleware } from 'redux'
import reducers from '../reducers';
import { apiMiddleware } from 'redux-api-middleware';

/**
 * Creates the store.
 * 
 * @return the store instance.
 */
export function configureStore() {
    return createStore(reducers, window.STATE_FROM_SERVER, applyMiddleware(apiMiddleware))
}