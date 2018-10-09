/**
 * @file
 * Redux actions for the login.
 *
 * @author Riccardo Busetti
 */
import { RSAA } from 'redux-api-middleware';

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
  // TODO: if already present, accessToken must be sent to the server somewhere
  console.log('Login attempt started');
  return {
    [RSAA]: {
      endpoint: 'https://aum.altervista.org/main.php',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        module: 'login',
        action: 'access',
        request_data: {
          username: username,
          password: hashFunction(password)    // TODO: da implementare funzione di hashing
        }
      }),
      types: [
        AUTH_ACTION_TYPE_KEYS.LOGIN_REQUEST,    // action dispatched before the request is done
        AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL, // action dispatched when login is successful
        AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED      // action dispatched when login fails
      ]
    }
  };
}

/**
 * Returns the login actions.
 * Just a placeholder used for testing UI.
 */
export function requestLoginPlaceholder() {
  console.log('Request login');
  return {
    [RSAA]: {
      endpoint: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      types: [
        AUTH_ACTION_TYPE_KEYS.LOGIN_REQUEST,
        AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL,
        AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED
      ]
    }
  };
}
/**
 * An hash function
 * @param {*} obj The object which the hash must be calculated from
 * @author Francesco Saltori
 */
function hashFunction(obj)
{
  // TODO
  throw new Error("Unimplemented function");
}