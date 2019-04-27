import { fork, put, select, take } from 'redux-saga/effects';
import { REQUEST_ENDPOINT_PATH } from '../../constants/api';
import {
  makeAuthenticatedApiRequest,
  removeAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage
} from '../../utils/apiUtils';
import { AUTH_ACTION_TYPE } from '../actions/auth';
import { USER_ACTION_TYPE } from '../actions/user';
import { makeAuthenticatedRequestAndReportErrors, makeUnauthenticatedRequestAndReportErrors } from './api';

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
  // Application startup: request local token validation to the server if it has been found
  const tokenAction = yield take([AUTH_ACTION_TYPE.TOKEN_VALIDATION_REQUESTED, AUTH_ACTION_TYPE.LOCAL_TOKEN_NOT_FOUND]);
  if (tokenAction.type === AUTH_ACTION_TYPE.TOKEN_VALIDATION_REQUESTED)
    yield requestLocalAccessTokenValidation(tokenAction);
  // prettier-ignore
  else
    console.log('Previously saved access token not found');

  let userLoggedIn = (yield select(state => state.auth.accessToken)) != null;
  while (true) {
    if (!userLoggedIn) {
      const loginRequestAction = yield take(AUTH_ACTION_TYPE.LOGIN_REQUESTED);
      const loginResponseData = yield makeUnauthenticatedRequestAndReportErrors(
        REQUEST_ENDPOINT_PATH.LOGIN,
        {
          username: loginRequestAction.username,
          password: loginRequestAction.password
        },
        { type: AUTH_ACTION_TYPE.LOGIN_FAILED }
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

    // Once the user has logged in, its information are requested to the server.
    // If this process fails, the user can choose to retry or log out.
    // That's why we watch for logout and user info request actions as long as the user is logged in.
    while (userLoggedIn) {
      const action = yield take([USER_ACTION_TYPE.GET_CURRENT_USER_INFO_REQUEST, AUTH_ACTION_TYPE.LOGOUT]);
      if (action.type === USER_ACTION_TYPE.GET_CURRENT_USER_INFO_REQUEST) {
        const userInfoResponseData = yield makeAuthenticatedRequestAndReportErrors(
          REQUEST_ENDPOINT_PATH.GET_USER_INFO,
          { type: USER_ACTION_TYPE.GET_CURRENT_USER_INFO_FAILED }
        );

        if (userInfoResponseData != null) {
          yield put({
            type: USER_ACTION_TYPE.GET_CURRENT_USER_INFO_SUCCESSFUL,
            ...userInfoResponseData
          });
          console.log('User info retrieved successfully');
        }
      } else {
        // accessToken is null in LOGOUT action when server logout notification is not needed (token already expired)
        // prettier-ignore
        if (action.accessToken != null)
          yield notifyLogoutToServerAsync(action.accessToken);

        removeAccessTokenFromLocalStorage();
        userLoggedIn = false;
      }
    }
  }
}

/**
 * Called when the user logs out
 * Notifies asynchronously the server that the user has logged out, so that it can invalidate the token
 * @param {*} action
 */
function* notifyLogoutToServerAsync(accessToken) {
  const logoutNotificationTask = yield fork(makeAuthenticatedApiRequest, REQUEST_ENDPOINT_PATH.LOGOUT, accessToken);

  // prettier-ignore
  logoutNotificationTask.toPromise().then(response => {
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
  const validationResponse = yield makeAuthenticatedApiRequest(
    REQUEST_ENDPOINT_PATH.VALIDATE_TOKEN,
    action.accessToken
  );

  if (validationResponse != null && validationResponse.ok) {
    yield put({
      type: AUTH_ACTION_TYPE.TOKEN_VALIDATION_SUCCESSFUL,
      accessToken: action.accessToken
    });
    console.log('Local access token is valid');
  } else {
    yield put({ type: AUTH_ACTION_TYPE.TOKEN_VALIDATION_FAILED });
    removeAccessTokenFromLocalStorage();
  }
}
