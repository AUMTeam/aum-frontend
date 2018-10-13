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
  accessToken: localStorage.getItem('token'), // TODO: da verificare autenticità con il server
  loggedInUserId: null,
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
      console.log('Login attempt started');
      return {
        ...state,
        isAttemptingLogin: true
      };
    // In this case, action.payload is the server response
    case AUTH_ACTION_TYPE_KEYS.LOGIN_SUCCESSFUL:
      console.log("Login successful")
      return {
        ...state,
        loggedInUserId: action.payload.response_data.user_id,
        accessToken: action.payload.response_data.token,
        isAttemptingLogin: false
      };
    // In this case, action.payload is an ApiError object
    case AUTH_ACTION_TYPE_KEYS.LOGIN_FAILED:
      console.error('API error ' + action.payload.status + ': ' + action.payload.response.message);
      return {
        ...state,
        isAttemptingLogin: false,
        errorMessage: action.payload.message
      };

    case AUTH_ACTION_TYPE_KEYS.LOGOUT_REQUEST:
      console.log("Sending logout request");
      return state;
    // For now, if logout notice to the server fails, we still log out the user and delete the token locally (should have no side-effects)
    case AUTH_ACTION_TYPE_KEYS.LOGOUT_FAILED:
      console.error("Unable to send logout request to server");
    case AUTH_ACTION_TYPE_KEYS.LOGOUT_SUCCESSFUL:
      return {
        ...initialState,
        accessToken: null
      };
    default:
      console.warn('Default condition reached in auth reducer: ' + action.type);
      return state;
  }
}
