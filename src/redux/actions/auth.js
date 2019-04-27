/**
 * @file
 * This file contains all the actions related to the authentication of the user.
 * The user when authorized has an unique access token, used to identify all the
 * requests from that specific user.
 * These actions notify success and failure for login, logout and validation of the token
 * used in the last session (when the user closes the app without logging out).
 */

export const AUTH_ACTION_TYPE = {
  LOGIN_REQUESTED: 'LOGIN_REQUESTED',
  LOGIN_SUCCESSFUL: 'LOGIN_SUCCESSFUL',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  LOCAL_TOKEN_NOT_FOUND: 'LOCAL_TOKEN_NOT_FOUND',
  TOKEN_VALIDATION_REQUESTED: 'TOKEN_VALIDATION_REQUESTED',
  TOKEN_VALIDATION_SUCCESSFUL: 'TOKEN_VALIDATION_SUCCESSFUL',
  TOKEN_VALIDATION_FAILED: 'TOKEN_VALIDATION_FAILED'
};

export function attemptLoginAction(username, password) {
  return {
    type: AUTH_ACTION_TYPE.LOGIN_REQUESTED,
    username,
    password
  };
}

export function performLogoutAction(accessToken = null) {
  return {
    type: AUTH_ACTION_TYPE.LOGOUT,
    accessToken
  };
}

export function requestLocalTokenValidationAction(accessToken) {
  return {
    type: AUTH_ACTION_TYPE.TOKEN_VALIDATION_REQUESTED,
    accessToken
  };
}
