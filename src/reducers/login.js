/**
 * @file
 * Redux reducers for the login.
 *
 * @author Riccardo Busetti
 */
import { LOGIN_ACTION_TYPE_KEYS } from '../actions/login';

/**
 * Initial state of the login.
 */
export const initialState = {
  accessToken: undefined
};

/**
 * Reducer function of the login.
 *
 * @param {*} state
 * @param {*} action
 */
export function login(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ACTION_TYPE_KEYS.LOGIN_REQUEST:
      return {
        ...state,
        accessToken: action.accessToken
      };
    case LOGIN_ACTION_TYPE_KEYS.LOGIN_SUCCESSFULL:
      break;
    case LOGIN_ACTION_TYPE_KEYS.LOGIN_FAILED:
      break;
    default:
      return state;
  }
}
