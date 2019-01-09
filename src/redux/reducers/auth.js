import { AUTH_ACTION_TYPE } from '../actions/auth';

/**
 * @file
 * This file contains the reducer for all the authentication dispatched actions.
 * When Redux dispatches an authentication-related action, it's going to be sent to this
 * reducer which changes the state in relation to the action type and content.
 */

const initialState = {
  accessToken: null,
  isAttemptingLogin: false,
  isValidatingToken: false,
  isSessionExpired: false
};

export function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPE.LOGIN_REQUESTED:
      return {
        ...state,
        isAttemptingLogin: true
      };
    case AUTH_ACTION_TYPE.LOGIN_SUCCESSFUL:
      return {
        ...state,
        accessToken: action.accessToken,
        isAttemptingLogin: false
      };
    case AUTH_ACTION_TYPE.LOGIN_FAILED:
      return {
        ...state,
        isAttemptingLogin: false
      };

    case AUTH_ACTION_TYPE.LOGOUT:
      return {
        ...initialState
      };
    case AUTH_ACTION_TYPE.SESSION_EXPIRED:
      return {
        ...state,
        isSessionExpired: true
      };
    
    case AUTH_ACTION_TYPE.TOKEN_VALIDATION_REQUESTED:
      return {
        ...state,
        isValidatingToken: true
      };
    case AUTH_ACTION_TYPE.TOKEN_VALIDATION_SUCCESSFUL:
      return {
        ...state,
        accessToken: action.accessToken,
        isValidatingToken: false
      };
    case AUTH_ACTION_TYPE.LOCAL_TOKEN_NOT_FOUND:
    case AUTH_ACTION_TYPE.TOKEN_VALIDATION_FAILED:
      return {
        ...state,
        accessToken: null,
        isValidatingToken: false
      };

    default:
      return state;
  }
}
