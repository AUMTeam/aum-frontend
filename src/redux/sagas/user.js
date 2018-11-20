import { makeAuthenticatedApiRequest } from '../../utils/apiUtils';
import { REQUEST_ACTIONS_PATHS } from '../../constants/api';

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
export function* requestCurrentUserInfo(action) {
  let responseReceived = false;
  let attemptNumber = 0;
  let response;

  while (!responseReceived) {
    attemptNumber++;
    console.log(`Retrieving user info: attempt ${attemptNumber}...`);
    response = yield makeAuthenticatedApiRequest(REQUEST_ACTIONS_PATHS.GET_USER_INFO,
      action.accessToken
    );
    
    if (response != null)
      responseReceived = true;
  }

  const responseJson = yield response.json();
  if (response.ok)
    return {
      userData: responseJson.response_data,
      errorMessage: null
    };
  else
    return {
      userData: null,
      errorMessage: responseJson.message
    };
}

export const userSaga = [];
