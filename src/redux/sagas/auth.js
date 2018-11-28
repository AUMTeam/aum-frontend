import { call, fork, put, select, take } from 'redux-saga/effects';
import { REQUEST_ACTIONS_PATH } from '../../constants/api';
import {
  makeAuthenticatedApiRequest,
  makeUnauthenticatedApiRequest,
  removeAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage
} from '../../utils/apiUtils';
import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';
import { USER_ACTION_TYPE_KEYS } from '../actions/user';
import { requestCurrentUserInfo } from './user';

/**
 * This function describes the order in which Saga must listen the dispatch of authentication-related
 * Redux actions and how it must behave according to them.
 * This function can be seen as a continuous background thread, which manages login/logout behavior
 * and makes API requests to the server.
 * The instruction flow may be summed up as follows:
 *   - watch for previous token validation request (only the first time)
 *   - if the token wasn't valid (the user hasn't been logged in), watch for login request
 *   - if login fails, continue watching for login requests
 *   - if login is successful, watch for current user info request
 *   - watch for logout request (whatever the result of the step above is)
 *   - when the user logs out, watch for subsequent login requests
 *   - and the loop continues...
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

  let userLoggedIn = (yield select(state => state.auth.accessToken)) != null;
  while (true) {
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
      } else {
        yield put({
          type: AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL,
          accessToken
        });
        console.log('Login successful');
        yield call(saveAccessTokenToLocalStorage, accessToken);
        userLoggedIn = true;
      }
    }

    // Once the user has logged in, watch for the request of its information
    if (userLoggedIn) {
      const currentUserInfoRequestAction = yield take(USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_REQUEST);
      const { userData, errorMessage } = yield call(requestCurrentUserInfo, currentUserInfoRequestAction);
      if (errorMessage != null) {
        yield put({
          type: USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_FAILED,
          errorMessage
        });
        console.error(`FATAL: Unable to get user info: ${errorMessage}`);
      } else {
        yield put({
          type: USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_SUCCESSFUL,
          ...userData
        });
        console.log('User info retrieved successfully');
      }

      // We watch for logout even if the server doesn't give us user info,
      // since we may want to display a fallback UI with a logout button
      const logoutAction = yield take(AUTH_ACTION_TYPE_KEYS.LOGOUT);
      yield call(notifyLogoutToServerAsync, logoutAction);
      yield call(removeAccessTokenFromLocalStorage);
      userLoggedIn = false;
    }
  }
}

/**
 * Called when the user logs out
 * Notifies asynchronously the server that the user has logged out, so that it can invalidate the token
 * @param {*} action
 */
function* notifyLogoutToServerAsync(action) {
  const logoutNotificationTask = yield fork(
    makeAuthenticatedApiRequest,
    REQUEST_ACTIONS_PATH.LOGOUT,
    action.accessToken
  );

  logoutNotificationTask.done.then(response => {
    if (response == null) console.error('Error during logout notification request to server');
    else if (response.ok) console.log('Logout notification successful');
    else console.error(`Server responded with an error after logout notification: ${response.statusText}`);
  });
}

/**
 * Called when the user clicks on Login button
 * Performs login request to the server and returns the token received or an error message
 * @param {*} action
 */
function* attemptLogin(action) {
  const response = yield makeUnauthenticatedApiRequest(REQUEST_ACTIONS_PATH.LOGIN, {
    username: action.username,
    password: action.password
  });

  if (response == null)
    return {
      accessToken: null,
      errorMessage: 'Richiesta al server fallita, possibile problema di connessione'
    };

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
 * Executed if a token is found in localStorage
 * Asks the server if the found token is still valid
 */
function* requestLocalAccessTokenValidation(action) {
  const response = yield makeAuthenticatedApiRequest(
    REQUEST_ACTIONS_PATH.VALIDATE_TOKEN,
    action.accessToken
  );

  if (response && response.ok) {
    yield put({
      type: AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_SUCCESSFUL,
      accessToken: action.accessToken
    });
    console.log('Local access token is valid');
  } else {
    yield put({ type: AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_FAILED });
    removeAccessTokenFromLocalStorage();
    if (response == null) console.error('An error occurred during token validation request to server');
    else if (response.status === 401)
      // Unauthorized, means that the token isn't valid anymore
      console.log('Local token is no more valid');
    else console.error(`Unexpected error code for token validation request: ${response.status}`);
  }
}
