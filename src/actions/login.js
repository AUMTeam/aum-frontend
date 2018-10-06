/**
 * @file
 * Redux actions for the login.
 *
 * @author Riccardo Busetti
 */

/**
 * Object containing all the action types.
 */
export const LOGIN_ACTION_TYPE_KEYS = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESSFULL: 'LOGIN_SUCCESSFULL',
  LOGIN_FAILED: 'LOGIN_FAILED'
};

/**
 * Returns the login actions.
 */
export function requestLogin() {
  console.log("Request login")
  return {
    type: LOGIN_ACTION_TYPE_KEYS.LOGIN_SUCCESSFULL,
    accessToken: 'DFJSHT5E6JNDG'
  };
}
