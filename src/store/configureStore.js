/**
 * @file
 * Redux store configuration.
 * 
 * @author Riccardo Busetti
 */

import { createStore } from 'redux'
import reducers from '../reducers';

/**
 * Creates the store.
 * 
 * @return the store instance.
 */
export function configureStore() {
    return createStore(reducers)
}