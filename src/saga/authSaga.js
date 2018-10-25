import { takeLatest } from 'redux-saga/effects';
import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';
import { REQUEST_ACTIONS_PATHS, makeUnauthenticatedApiRequest, makeAuthenticatedApiRequest } from '../utils/apiUtils';

/**
 * @file
 * This file contains all the defined saga actions related to authentication,
 * that will be triggered asynchronously when redux dispatches a new action.
 * Thanks to these functions we are going to handle all the side-effect of the
 * application.
 */

/**
 * Called when the user logs out
 * Notifies the server that the user has logged out, so that it can invalidate the token
 * @param {*} action 
 */
function* notifyLogoutToServer(action) {
  const response = yield makeAuthenticatedApiRequest(REQUEST_ACTIONS_PATHS.LOGOUT, action.accessToken);
  if (response.ok)
    console.log("Logout notification successful");
  else
    console.error(`Logout notification failed to server: ${response.statusText}`);
}

function* saveAccessTokenToLocalStorage(action) {
  console.log('Saving access token to local storage');
  try {
    yield localStorage.setItem('token', action.payload.response_data.token);
  } catch (err) {
    console.error('Unable to save access token in local storage.');
  }
}

function* removeAccessTokenFromLocalStorage() {
  console.log('Removing access token from local storage');
  try {
    yield localStorage.removeItem('token');
  } catch (err) {
    console.error('Unable to remove access token from local storage.');
  }
}

export const authSaga = [
  takeLatest(
    AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL,
    saveAccessTokenToLocalStorage
  ),
  // If logout notice to the server fails, we still log out the user and delete the token locally (should have no side-effects).
  takeLatest(AUTH_ACTION_TYPE_KEYS.LOGOUT, notifyLogoutToServer),
  takeLatest(AUTH_ACTION_TYPE_KEYS.LOGOUT, removeAccessTokenFromLocalStorage),
  takeLatest(
    AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_FAILED,
    removeAccessTokenFromLocalStorage
  )
];
