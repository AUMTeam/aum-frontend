import { sha256 } from 'js-sha256';
import { RSAA } from 'redux-api-middleware';

/**
 * @file
 * This file contains all the actions related to the authorization of the user.
 * The user when authorized has an unique access token, used to identify all the
 * requests from that specific user.
 */

const API_ENDPOINT_URL = 'http://aum.altervista.org/main';

export const AUTH_ACTION_TYPE_KEYS = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESSFUL: 'LOGIN_SUCCESSFUL',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESSFUL: 'LOGOUT_SUCCESSFUL',
  LOGOUT_FAILED: 'LOGOUT_FAILED',
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
        module: 'login',
        action: 'access',
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
        'X-Auth-Header': accessToken // TODO: not definitive
      },
      body: JSON.stringify({
        module: 'login',
        action: 'signout',
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
  return {
    [RSAA]: {
      endpoint: API_ENDPOINT_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Header': accessToken // TODO: not definitive
      },
      body: JSON.stringify({
        module: 'login',
        action: 'auth',
        request_data: {}
      }),
      types: [
        AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_REQUEST,
        {
          type: AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_SUCCESSFUL,
          meta: {
            accessToken
          },
          payload: (action, state) => ({ endpoint: action.endpoint })
        },
        AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_SUCCESSFUL,
        AUTH_ACTION_TYPE_KEYS.TOKEN_VALIDATION_FAILED
      ]
    }
  };
}

function computeSHA256(obj) {
  return sha256(obj.toString()).toUpperCase();
}
