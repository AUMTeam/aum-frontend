import { takeLatest, put, fork, take } from 'redux-saga/effects';
import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';
import {
  REQUEST_ACTIONS_PATHS,
  makeUnauthenticatedApiRequest,
  makeAuthenticatedApiRequest
} from '../utils/apiUtils';
import { computeSHA256 } from '../utils/apiUtils';

/**
 * @file
 * This file contains all the defined saga actions related to authentication,
 * that will be triggered asynchronously when redux dispatches a new action.
 * Thanks to these functions we are going to handle all the side-effect of the
 * application.
 */

/**
 * Called when the user logs out
 * Notifies asynchronously the server that the user has logged out, so that it can invalidate the token
 * @param {*} action
 */
function* notifyLogoutToServer(action) {
  const logoutNotificationTask = yield fork(makeAuthenticatedApiRequest,
    REQUEST_ACTIONS_PATHS.LOGOUT,
    action.accessToken
  );

  logoutNotificationTask.done.then((response) => {
    if (response.ok)
      console.log('Logout notification successful');
    else
      console.error(`Logout notification failed to server: ${response.statusText}`);
  }).catch((error) => {
    console.error(`Error during logout notification to server: ${error}`);
  });
}

/**
 * Called when the user clicks on Login button
 * Performs login request to the server and dispatches actions according to its outcome
 * @param {*} action
 */
function* attemptLogin(action) {
  if (action.username === '' || action.password === '') {
    yield put({
      type: AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED,
      errorMessage: 'Username e/o password mancante'
    });
  } else {
    const response = yield makeUnauthenticatedApiRequest(REQUEST_ACTIONS_PATHS.LOGIN, {
      username: action.username,
      hash_pass: computeSHA256(action.password)
    });

    const responseJson = yield response.json();
    if (response.ok) {
      yield put({
        type: AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL,
        accessToken: responseJson.response_data.token
      });
      console.log(
        `Login successful with access token ${responseJson.response_data.token}`
      );
    } else {
      yield put({
        type: AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED,
        errorMessage: responseJson.message
      });
      console.error(
        `Login API error ${responseJson.status}: ${responseJson.message}`
      );
    }
  }
}

/**
 * Executed at app startup if a token is found in localStorage
 * Asks the server if the found token is still valid
 */
function* requestLocalAccessTokenValidation(action) {
  const response = yield makeAuthenticatedApiRequest(REQUEST_ACTIONS_PATHS.VALIDATE_TOKEN,
    action.accessToken
  );

  if (response.ok) {
    yield put({
      type: AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_SUCCESSFUL,
      accessToken: action.accessToken
    });
    console.log('Local access token is valid');
  }
  else {
    yield put({ type: AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_FAILED });
    if (response.status === 401)    // Unauthorized, means that the token isn't valid anymore
      console.log("Local token is no more valid");
    else    // Shouldn't happen, could be a server bug
      console.error(`Unexpected error code for token validation request: ${response.status}`);
  }
}

function* saveAccessTokenToLocalStorage(action) {
  console.log('Saving access token to local storage');
  try {
    yield localStorage.setItem('token', action.accessToken);
  } catch (err) {
    console.error(`Unable to save access token in local storage: ${err}`);
  }
}

function* removeAccessTokenFromLocalStorage() {
  console.log('Removing access token from local storage');
  try {
    yield localStorage.removeItem('token');
  } catch (err) {
    console.error(`Unable to remove access token from local storage: ${err}`);
  }
}

export const authSaga = [
  takeLatest(AUTH_ACTION_TYPE_KEYS.LOGIN_REQUESTED, attemptLogin),
  takeLatest(AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_REQUESTED, requestLocalAccessTokenValidation),
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
