import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';

/**
 * @file
 * This file contains the reducer for all the authentication dispatched actions.
 * When Redux dispatches an authentication-related action, it's going to be sent to this
 * reducer which changes the state in relation to the action type and content.
 */

export const initialState = {
  accessToken: null,
  isAttemptingLogin: false,
  isValidatingToken: false,
  loginErrorMessage: null
};

export function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPE_KEYS.LOGIN_REQUESTED:
      return {
        ...state,
        isAttemptingLogin: true
      };
    case AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL:
      return {
        ...state,
        accessToken: action.accessToken,
        isAttemptingLogin: false
      };
    case AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED:
      return {
        ...state,
        isAttemptingLogin: false,
        loginErrorMessage: action.errorMessage
      };

    case AUTH_ACTION_TYPE_KEYS.LOGOUT:
      return {
        ...initialState
      };

    case AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_REQUEST:
      console.log('Validating local token');
      return {
        ...state,
        isValidatingToken: true
      };
    case AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_SUCCESSFUL:
      console.log('Local access token is valid');
      return {
        ...state,
        accessToken: action.meta.accessToken,
        isValidatingToken: false
      };
    case AUTH_ACTION_TYPE_KEYS.LOCAL_TOKEN_NOT_FOUND:
    case AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_FAILED:
      console.log("Token is no more valid or hasn't been found locally");
      return {
        ...state,
        accessToken: null,
        isValidatingToken: false
      };

    default:
      return state;
  }
}
