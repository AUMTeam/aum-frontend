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
  console.log('Saving access token');
  try {
    yield localStorage.setItem('token', action.payload.response_data.token);
  }
  catch (err) {
    console.error("Unable to save access token in local storage.");
  }
}

/**
 * Removes the access token from the local storage
 * of the browser.
 * 
 * @param {*} action redux dispatched action.
 */
function* removeAccessToken(action) {
  console.log('Removing access token');
  try {
    yield localStorage.removeItem('token');
  }
  catch (err) {
    console.error("Unable to remove access token from local storage.");
  }
}

/**
 * List of sagas that will take the latest actions from redux.
 * 
 */
export const authSaga = [
  takeLatest(AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL, saveAccessToken),
  takeLatest(AUTH_ACTION_TYPE_KEYS.LOGOUT_SUCCESSFUL, removeAccessToken),
  // For now, if logout notice to the server fails, we still log out the user and delete the token locally (should have no side-effects)
  takeLatest(AUTH_ACTION_TYPE_KEYS.LOGOUT_FAILED, removeAccessToken)
];
