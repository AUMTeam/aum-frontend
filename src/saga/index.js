/**
 * @file
 * Index of all the sagas used in the app.
 * 
 * @author Riccardo Busetti
 */
import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';

/**
 * All the sagas implemented through the app.
 */
export default function* sagas() {
    yield all([...authSaga])
}