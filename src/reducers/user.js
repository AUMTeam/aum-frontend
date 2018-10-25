import { USER_ACTION_TYPE_KEYS } from '../actions/user';
import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';

/**
 * @file
 * This file contains the reducer for dispatched actions related to user data.
 * When Redux dispatches an user-related action, this reducer will change the 
 * state in relation to the action type and content.
 */

export const USER_TYPE_IDS = {
  CLIENT: 1,
  TECHNICAL_AREA_MANAGER: 2,
  REVISION_OFFICE_MANAGER: 3,
  PROGRAMMER: 4
}

export const initialState = {
  id: null,
  name: null,
  area: null,
  email: null,
  roles: [],
  infoObtained: false
};

export function user(state = initialState, action) {
  switch (action.type) {
    case USER_ACTION_TYPE_KEYS.GET_USER_INFO_REQUEST:
      console.log("Requesting user info...");
      return {
        infoObtained: false,
        ...state
      };
    case USER_ACTION_TYPE_KEYS.GET_USER_INFO_FAILED:
      console.error(`Unable to get user info: ${action.payload.response.message}`);
      return {
        infoObtained: false,
        ...state
      };
    case USER_ACTION_TYPE_KEYS.GET_USER_INFO_SUCCESSFUL:
      console.log("User info received");
      return {
        infoObtained: true,
        id: action.payload.response_data.user_id,
        name: action.payload.response_data.name,
        area: action.payload.response_data.area,
        email: action.payload.response_data.email,
        roles: action.payload.response_data.role
      };

    // We need to wipe all user-related data when user logs out
    // We don't want to have old values when another user logs in
    case AUTH_ACTION_TYPE_KEYS.LOGOUT_SUCCESSFUL:
    case AUTH_ACTION_TYPE_KEYS.LOGOUT_FAILED:
      return {
        ...initialState
      };
      
    default:
      return state;
  }
}
