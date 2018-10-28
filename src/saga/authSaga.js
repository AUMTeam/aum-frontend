import { put, fork, take, call, select } from 'redux-saga/effects';
import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';
import { USER_ACTION_TYPE_KEYS } from '../actions/user';
import { requestCurrentUserInfo } from './userSaga';
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

export function* authFlowSaga() {
  // Application startup: request local token validation to the server if it's found
  const tokenValidationRequestAction = yield take(AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_REQUESTED);
  if (tokenValidationRequestAction.accessToken == null) {
    yield put({ type: AUTH_ACTION_TYPE_KEYS.LOCAL_TOKEN_NOT_FOUND });
    console.log('Previous token not found in localStorage');
  } else {
    yield call(requestLocalAccessTokenValidation, tokenValidationRequestAction);
  }

  while (true) {
    let userLoggedIn = (yield select(state => state.auth.accessToken)) != null;
    // If the user hasn't been logged in with the local token found in localStorage,
    // watch for login request action
    if (!userLoggedIn) {
      const loginRequestAction = yield take(AUTH_ACTION_TYPE_KEYS.LOGIN_REQUESTED);
      const { accessToken, errorMessage } = yield call(attemptLogin, loginRequestAction);
      if (errorMessage != null) {
        yield put({
          type: AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED,
          errorMessage
        });
        console.error(`Login API error: ${errorMessage}`);
      }
      else {
        yield put({
          type: AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL,
          accessToken
        });
        console.log(`Login successful with access token ${accessToken}`);
        yield call(saveAccessTokenToLocalStorage, accessToken);
        userLoggedIn = true;
      }
    }

    // Once the user has logged in, watch for the request of its information
    if (userLoggedIn) {
      const currentUserInfoRequestAction = yield take(
        USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_REQUEST
      );
      const { userData, errorMessage } = yield call(
        requestCurrentUserInfo,
        currentUserInfoRequestAction
      );
      if (errorMessage != null) {
        yield put({
          type: USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_FAILED,
          errorMessage
        });
        console.error(`FATAL: Unable to get user info: ${errorMessage}`);
      }
      else {
        yield put({
          type: USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_SUCCESSFUL,
          ...userData
        });
        console.log('User info retrieved successfully');
      }

      // We watch for logout even if the server doesn't give us user info,
      // since we may want to display a fallback UI with a logout button
      const logoutAction = yield take(AUTH_ACTION_TYPE_KEYS.LOGOUT);
      yield call(notifyLogoutToServer, logoutAction);
      yield call(removeAccessTokenFromLocalStorage);
    }
  }
}

/**
 * Called when the user logs out
 * Notifies asynchronously the server that the user has logged out, so that it can invalidate the token
 * @param {*} action
 */
function* notifyLogoutToServer(action) {
  const logoutNotificationTask = yield fork(
    makeAuthenticatedApiRequest,
    REQUEST_ACTIONS_PATHS.LOGOUT,
    action.accessToken
  );

  logoutNotificationTask.done
    .then(response => {
      if (response.ok)
        console.log('Logout notification successful');
      else
        console.error(`Logout notification failed to server: ${response.statusText}`);
    })
    .catch(error => {
      console.error(`Error during logout notification to server: ${error}`);
    });
}

/**
 * Called when the user clicks on Login button
 * Performs login request to the server and returns the token received or an error message
 * @param {*} action
 */
function* attemptLogin(action) {
  if (action.username === '' || action.password === '')
    return {
      accessToken: null,
      errorMessage: 'Username e/o password mancante'
    };

  const response = yield makeUnauthenticatedApiRequest(REQUEST_ACTIONS_PATHS.LOGIN, {
    username: action.username,
    hash_pass: computeSHA256(action.password)
  });

  const responseJson = yield response.json();
  if (response.ok)
    return {
      accessToken: responseJson.response_data.token,
      errorMessage: null
    };
  else
    return {
      accessToken: null,
      errorMessage: responseJson.message
    };
}

/**
 * Executed at app startup if a token is found in localStorage
 * Asks the server if the found token is still valid
 */
function* requestLocalAccessTokenValidation(action) {
  const response = yield makeAuthenticatedApiRequest(
    REQUEST_ACTIONS_PATHS.VALIDATE_TOKEN,
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
    removeAccessTokenFromLocalStorage();
    if (response.status === 401) // Unauthorized, means that the token isn't valid anymore
      console.log('Local token is no more valid');
    else     // Shouldn't happen, could be a server bug
      console.error(`Unexpected error code for token validation request: ${response.status}`);
  }
}

function saveAccessTokenToLocalStorage(accessToken) {
  console.log('Saving access token to local storage');
  try {
    localStorage.setItem('token', accessToken);
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
