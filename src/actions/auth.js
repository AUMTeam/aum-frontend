import { sha256 } from 'js-sha256';
import { RSAA } from 'redux-api-middleware';
import { API_ENDPOINT_URL } from '.';

/**
 * @file
 * This file contains all the actions related to the authentication of the user.
 * The user when authorized has an unique access token, used to identify all the
 * requests from that specific user.
 * These actions notify success and failure for login, logout and validation of the token
 * used in the last session (when the user closes the app without logging out).
 */

export const AUTH_ACTION_TYPE_KEYS = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESSFUL: 'LOGIN_SUCCESSFUL',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESSFUL: 'LOGOUT_SUCCESSFUL',
  LOGOUT_FAILED: 'LOGOUT_FAILED',
  LOCAL_TOKEN_NOT_FOUND: 'LOCAL_TOKEN_NOT_FOUND',
  TOKEN_VALIDATION_REQUEST: 'TOKEN_VALIDATION_REQUEST',
  TOKEN_VALIDATION_SUCCESSFUL: 'TOKEN_VALIDATION_SUCCESSFUL',
  TOKEN_VALIDATION_FAILED: 'TOKEN_VALIDATION_FAILED'
};

export function attemptLogin(username, password) {
  return {
    [RSAA]: {
      endpoint: API_ENDPOINT_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        module: 'auth',
        action: 'login',
        request_data: {
          username,
          hash_pass: computeSHA256(password)
        }
      }),
      types: [
        AUTH_ACTION_TYPE_KEYS.LOGIN_REQUEST,
        AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL,
        AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED
      ]
    }
  };
}

export function attemptLogout(accessToken) {
  return {
    [RSAA]: {
      endpoint: API_ENDPOINT_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Header': accessToken
      },
      body: JSON.stringify({
        module: 'auth',
        action: 'logout',
        request_data: {}
      }),
      types: [
        AUTH_ACTION_TYPE_KEYS.LOGOUT_REQUEST,
        AUTH_ACTION_TYPE_KEYS.LOGOUT_SUCCESSFUL,
        AUTH_ACTION_TYPE_KEYS.LOGOUT_FAILED
      ]
    }
  };
}

export function validateLocalAccessToken(accessToken) {
  if (accessToken == null)
    return { type: AUTH_ACTION_TYPE_KEYS.LOCAL_TOKEN_NOT_FOUND };
  else
    return {
      [RSAA]: {
        endpoint: API_ENDPOINT_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Header': accessToken
        },
        body: JSON.stringify({
          module: 'auth',
          action: 'validateToken',
          request_data: {}
        }),
        types: [
          AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_REQUEST,
          // custom action type definition
          {
            type: AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_SUCCESSFUL,
            // Here we are including the validated token into the VALIDATION_SUCCESSFUL action object
            meta: {
              accessToken
            },
            payload: (action, state) => ({ endpoint: action.endpoint })
          },
          AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_FAILED
        ]
      }
    };
}

function computeSHA256(obj) {
  return sha256(obj.toString()).toUpperCase();
}
