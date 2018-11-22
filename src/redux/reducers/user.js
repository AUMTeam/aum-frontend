import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';
import { USER_ACTION_TYPE_KEYS } from '../actions/user';

/**
 * @file
 * This file contains the reducer for dispatched actions related to user data.
 * When Redux dispatches an user-related action, this reducer will change the
 * state in relation to the action type and content.
 */

const initialState = {
  id: null,
  name: null,
  area: null,
  email: null,
  roles: [],
  infoObtained: false
};

export function user(state = initialState, action) {
  switch (action.type) {
    case USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_REQUEST:
      return {
        infoObtained: false,
        ...state
      };
    case USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_FAILED:
      return {
        infoObtained: false,
        ...state
      };
    case USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_SUCCESSFUL:
      return {
        infoObtained: true,
        id: action.user_id,
        name: action.name,
        area: action.area,
        email: action.email,
        roles: action.role
      };

    // We need to wipe all user-related data when user logs out
    // We don't want to have old values when another user logs in
    case AUTH_ACTION_TYPE_KEYS.LOGOUT:
      return {
        ...initialState
      };

    default:
      return state;
  }
}
