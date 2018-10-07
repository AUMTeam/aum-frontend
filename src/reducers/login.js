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
  posts: undefined,
  isLoadingPosts: undefined
};

/**
 * Reducer function of the login.
 *
 * @param {*} state main state of the app.
 * @param {*} action dispatched action.
 */
export function login(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ACTION_TYPE_KEYS.LOGIN_REQUEST:
      return {
        ...state,
        isLoadingPosts: true
      };
    case LOGIN_ACTION_TYPE_KEYS.LOGIN_SUCCESSFULL:
      return {
        ...state,
        posts: action.payload,
        isLoadingPosts: false
      };
    case LOGIN_ACTION_TYPE_KEYS.LOGIN_FAILED:
      return {
        ...state,
        isLoadingPosts: false
      };
    default:
      return state;
  }
}
