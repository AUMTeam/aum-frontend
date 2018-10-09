/**
 * @file
 * Redux reducers for the login.
 *
 * @author Riccardo Busetti
 */
import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';

/**
 * Initial state of the authentication.
 */
export const initialState = {
  accessToken: localStorage.getItem('token'),      // TODO: it will be loaded form cache if already present
  loggedInUsername: null,
  loggedInUserRole: null,
  isAttemptingLogin: false,
  errorMessage: null
};

/**
 * Reducer function of the authentication.
 *
 * @param {*} state main state of the app.
 * @param {*} action action supplied by API Middleware (see attemptLogin in actions/auth.js)
 */
export function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPE_KEYS.LOGIN_REQUEST:
      return {
        ...state,
        isAttemptingLogin: true
      };
    // In this case, action.payload is the server response 
    case AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL:
      return {
        ...state,
        loggedInUsername: action.payload.response_data.username,
        loggedInUserRole: action.payload.response_data.userRole,
        accessToken: action.payload.response_data.token,
        isAttemptingLogin: false
      };
    // In this case, action.payload is an ApiError object
    case AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED:
      console.error("API error: " + action.payload.response.dev_message);
      return {
        ...state,
        isAttemptingLogin: false,
        errorMessage: action.payload.message,
      };
    case AUTH_ACTION_TYPE_KEYS.FAKE_LOGIN:
      localStorage.setItem('token', action.accessToken)
      return {
        ...state,
        accessToken: action.accessToken
      }  
    case AUTH_ACTION_TYPE_KEYS.FAKE_LOGOUT:
      localStorage.removeItem('token')
      return {
        ...state,
        accessToken: action.accessToken
      }  
    default:
      console.warn("Default condition reached in auth reducer: " + action.type);
      return state;
  }
}
