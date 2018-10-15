import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';

/**
 * @file
 * This file contains the reducer for all the authorization dispatched actions.
 * When redux dispatches an authorization related action is going to be sent to this
 * reducer which changes the state in relation to the action type and content.
 */

export const initialState = {
  accessToken: null, // TODO: we need to check if the token is valid through an api request.
  loggedInUserId: null,
  loggedInUsername: null,
  loggedInUserRole: null,
  isAttemptingLogin: false,
  isTokenValid: false,
  isValidatingToken: false,
  errorMessage: null
};

export function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPE_KEYS.LOGIN_REQUEST:
      console.log('Login attempt request sent');
      return {
        ...state,
        isAttemptingLogin: true
      };
    case AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL:
      console.log(
        'Login successful with access token ' +
          action.payload.response_data.token
      );
      return {
        ...state,
        loggedInUserId: action.payload.response_data.user_id,
        accessToken: action.payload.response_data.token,
        isAttemptingLogin: false
      };
    case AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED:
      console.error(
        'API error ' +
          action.payload.status +
          ': ' +
          action.payload.response.message
      );
      return {
        ...state,
        isAttemptingLogin: false,
        errorMessage: action.payload.message
      };
    case AUTH_ACTION_TYPE_KEYS.LOGOUT_REQUEST:
      console.log('Sending logout request');
      return state;
    case AUTH_ACTION_TYPE_KEYS.LOGOUT_FAILED: // For now, if logout notice to the server fails, we still log out the user and delete the token locally (should have no side-effects).
      console.error('Unable to send logout request to server');
    case AUTH_ACTION_TYPE_KEYS.LOGOUT_SUCCESSFUL:
      return {
        ...initialState,
        accessToken: null
      };
    case AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_REQUEST:
      return {
        ...state,
        isTokenValid: false,
        isValidatingToken: true
      };
    case AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_SUCCESSFUL:
      console.log("Token is valid")
      console.log(action.payload)
      return {
        ...state,
        accessToken: action.meta.accessToken,
        isTokenValid: true,
        isValidatingToken: false
      };
    case AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_FAILED:
      console.warn("Token is no more valid")
      return {
        ...state,
        accessToken: null,
        isTokenValid: false,
        isValidatingToken: false
      };
    default:
      console.warn('Default condition reached in auth reducer: ' + action.type);
      return state;
  }
}
