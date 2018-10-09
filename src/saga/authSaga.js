/**
 * @file
 * Sagas related to the authentication.
 * 
 * @author Riccardo Busetti
 */
import { takeLatest } from 'redux-saga/effects';
import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';

/**
 * Saves the access token inside of the local storage
 * of the browser.
 * 
 * @param {*} action redux dispatched action.
 */
function* saveAccessToken(action) {
  console.log('SAVING ACCESS TOKEN');
  localStorage.setItem('token', action.accessToken);
}

/**
 * Removes the access token from the local storage
 * of the browser.
 * 
 * @param {*} action redux dispatched action.
 */
function* removeAccessToken(action) {
  console.log('REMOVING ACCESS TOKEN');
  localStorage.removeItem('token');
}

/**
 * List of sagas that will take the latest actions from redux.
 */
export const authSaga = [
  takeLatest(AUTH_ACTION_TYPE_KEYS.FAKE_LOGIN, saveAccessToken),
  takeLatest(AUTH_ACTION_TYPE_KEYS.FAKE_LOGOUT, removeAccessToken)
];
