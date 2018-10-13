/**
 * @file
 * Redux actions for the login.
 *
 * @author Riccardo Busetti
 */
import { RSAA } from 'redux-api-middleware';
import { sha256 } from 'js-sha256';

const API_URL = 'http://aum.altervista.org/main';

/**
 * Object containing all the action types.
 */
export const AUTH_ACTION_TYPE_KEYS = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESSFUL: 'LOGIN_SUCCESSFUL',
  LOGIN_FAILED: 'LOGIN_FAILED'
};

/**
 * It returns the action that makes a login request
 * Uses API Middleware to make the API request and dispatch actions according to its result.
 *
 * @param username The username
 * @param password The password
 * @author Francesco Saltori, Riccardo Busetti
 */
export function attemptLogin(username, password) {
  console.log('Login attempt started');
  return {
    [RSAA]: {
      endpoint: API_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        module: 'login',
        action: 'access',
        request_data: {
          username: username,
          hash_pass: computeSHA256(password)
        }
      }),
      types: [
        AUTH_ACTION_TYPE_KEYS.LOGIN_REQUEST, // action dispatched before the request is done
        AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL, // action dispatched when login is successful
        AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED // action dispatched when login fails
      ]
    }
  };
}

/**
 * Computes the SHA256 hash for the given object
 * @param {*} obj The object which the hash is calculated from
 * @author Francesco Saltori
 */
function computeSHA256(obj) {
  return sha256(obj.toString()).toUpperCase();
}
