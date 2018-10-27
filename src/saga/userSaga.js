import { takeLatest, put } from 'redux-saga/effects';
import { USER_ACTION_TYPE_KEYS } from '../actions/user';
import {
  REQUEST_ACTIONS_PATHS,
  makeAuthenticatedApiRequest
} from '../utils/apiUtils';

/**
 * @file
 * This file contains all the defined saga actions related to fetching and manipulating user data,
 * that will be triggered asynchronously when a new action is dispatched.
 */

/**
 * Called once login turned out to be successful
 * Requests the info about the logged in user. If the request fails for network errors, the app 
 * keeps retrying.
 */
function* requestCurrentUserInfo(action) {
  let responseReceived = false;
  let attemptNumber = 0;
  let response;

  while (!responseReceived) {
    attemptNumber++;
    console.log(`Retrieving user info: attempt ${attemptNumber}...`);
    // Try/catch block handles network errors
    try {
      response = yield makeAuthenticatedApiRequest(REQUEST_ACTIONS_PATHS.GET_USER_INFO,
        action.accessToken
      );
      responseReceived = true;
    }
    catch (error) {
      console.error(error);
    }
  }

  const responseJson = yield response.json();
  if (response.ok) {
    yield put({
      type: USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_SUCCESSFUL,
      ...responseJson.response_data
    });
    console.log('User info retrieved successfully');
  }
  else {
    yield put({ type: USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_FAILED });
    console.error(`FATAL: Unable to get user info: ${responseJson.message}`);
  }
}

export const userSaga = [
  takeLatest(
    USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_REQUEST,
    requestCurrentUserInfo
  )
];
