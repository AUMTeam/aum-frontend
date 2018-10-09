/**
 * @file
 * Redux actions for the login.
 *
 * @author Riccardo Busetti
 */
import { RSAA } from 'redux-api-middleware';

const API_URL = 'https://aum.altervista.org/main.php';

/**
 * Object containing all the action types.
 */
export const AUTH_ACTION_TYPE_KEYS = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESSFUL: 'LOGIN_SUCCESSFUL',
  LOGIN_FAILED: 'LOGIN_FAILED',
  FAKE_LOGIN: 'FAKE_LOGIN',
  FAKE_LOGOUT: 'FAKE_LOGOUT'
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
          password: hashFunction(password) // TODO: da implementare funzione di hashing
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

export function fakeLogin() {
  return {
    type: AUTH_ACTION_TYPE_KEYS.FAKE_LOGIN,
    accessToken: 'AQ4JHHJSEFB435'
  };
}

export function fakeLogout() {
  return {
    type: AUTH_ACTION_TYPE_KEYS.FAKE_LOGOUT,
    accessToken: null
  };
}

/**
 * An hash function
 * @param {*} obj The object which the hash must be calculated from
 * @author Francesco Saltori
 */
function hashFunction(obj) {
  // TODO
  throw new Error('Unimplemented function');
}
