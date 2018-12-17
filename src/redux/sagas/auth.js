import { call, fork, put, select, take } from 'redux-saga/effects';
import { REQUEST_ACTIONS_PATH } from '../../constants/api';
import {
  makeAuthenticatedApiRequest,
  removeAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage
} from '../../utils/apiUtils';
import { AUTH_ACTION_TYPE } from '../actions/auth';
import { USER_ACTION_TYPE } from '../actions/user';
import { makeRequestAndReportErrors } from './api';

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
  const tokenValidationRequestAction = yield take(AUTH_ACTION_TYPE.TOKEN_VALIDATION_REQUESTED);
  if (tokenValidationRequestAction.accessToken == null) {
    yield put({ type: AUTH_ACTION_TYPE.LOCAL_TOKEN_NOT_FOUND });
    console.log('Previous token not found in localStorage');
  }
  else
    yield call(requestLocalAccessTokenValidation, tokenValidationRequestAction);

  let userLoggedIn = (yield select(state => state.auth.accessToken)) != null;
  while (true) {
    // If the user hasn't been logged in with the local token found in localStorage,
    // watch for login request action
    if (!userLoggedIn) {
      const loginRequestAction = yield take(AUTH_ACTION_TYPE.LOGIN_REQUESTED);
      const loginResponseData = yield makeRequestAndReportErrors(
        REQUEST_ACTIONS_PATH.LOGIN,
        { type: AUTH_ACTION_TYPE.LOGIN_FAILED },
        {
          username: loginRequestAction.username,
          password: loginRequestAction.password
        }
      );

      if (loginResponseData != null) {
        yield put({
          type: AUTH_ACTION_TYPE.LOGIN_SUCCESSFUL,
          accessToken: loginResponseData.token
        });
        console.log('Login successful');
        saveAccessTokenToLocalStorage(loginResponseData.token);
        userLoggedIn = true;
      }
    }

    // Once the user has logged in, watch for the request of its information
    if (userLoggedIn) {
      const userInfoRequestAction = yield take(USER_ACTION_TYPE.GET_CURRENT_USER_INFO_REQUEST);
      const userInfoResponseData = yield makeRequestAndReportErrors(
        REQUEST_ACTIONS_PATH.GET_USER_INFO,
        { type: USER_ACTION_TYPE.GET_CURRENT_USER_INFO_FAILED },
        null,
        userInfoRequestAction.accessToken
      );

      if (userInfoResponseData != null) {
        yield put({
          type: USER_ACTION_TYPE.GET_CURRENT_USER_INFO_SUCCESSFUL,
          ...userInfoResponseData
        });
        console.log('User info retrieved successfully');
      }

      // We watch for logout even if the server doesn't give us user info,
      // since in that case an error dialog with a logout button is displayed
      const logoutAction = yield take(AUTH_ACTION_TYPE.LOGOUT);
      if (logoutAction.accessToken != null)
        yield call(notifyLogoutToServerAsync, logoutAction.accessToken);

      removeAccessTokenFromLocalStorage();
      userLoggedIn = false;
    }
  }
}

/**
 * Called when the user logs out
 * Notifies asynchronously the server that the user has logged out, so that it can invalidate the token
 * @param {*} action
 */
function* notifyLogoutToServerAsync(accessToken) {
  const logoutNotificationTask = yield fork(
    makeAuthenticatedApiRequest,
    REQUEST_ACTIONS_PATH.LOGOUT,
    accessToken
  );

  logoutNotificationTask.done.then(response => {
    if (response == null)
      console.error('Error during logout notification request to server');
    else if (response.ok)
      console.log('Logout notification successful');
    else
      console.error(`Server responded with an error after logout notification: ${response.statusText}`);
  });
}

/**
 * Executed if a token is found in localStorage
 * Asks the server if the found token is still valid
 */
function* requestLocalAccessTokenValidation(action) {
  const validationResponseData = yield makeRequestAndReportErrors(
    REQUEST_ACTIONS_PATH.VALIDATE_TOKEN,
    { type: AUTH_ACTION_TYPE.TOKEN_VALIDATION_FAILED },
    null,
    action.accessToken,
    false
  );

  if (validationResponseData != null) {
    yield put({
      type: AUTH_ACTION_TYPE.TOKEN_VALIDATION_SUCCESSFUL,
      accessToken: action.accessToken
    });
    console.log('Local access token is valid');
  }
  else
    removeAccessTokenFromLocalStorage();
}
