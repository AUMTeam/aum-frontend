/**
 * @file
 * Redux reducers for the login.
 *
 * @author Riccardo Busetti
 */
import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';

/**
 * Initial state of the login.
 */
export const initialState = {
  accessToken: null,
  loggedInUsername: null,
  loggedInUserRole: null,
  
};

/**
 * Reducer function of the login.
 *
 * @param {*} state main state of the app.
 * @param {*} action dispatched action.
 */
export function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPE_KEYS.LOGIN_REQUEST:
      return {
        ...state
      };
    case AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL:
      return {
        ...state
      };
    case AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED:
      return {
        ...state
      };
    default:
      return state;
  }
}
