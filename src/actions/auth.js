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
 * Returns the login actions.
 * 
 * @todo Questo metodo è solo un placeholder per mostrare
 * il funzionamento di api middleware. Non centra con la login.
 */
export function requestLogin() {
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
