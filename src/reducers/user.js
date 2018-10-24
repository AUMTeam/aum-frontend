import { USER_ACTION_TYPE_KEYS } from '../actions/user';

/**
 * @file
 * This file contains the reducer for dispatched actions related to user data.
 * When Redux dispatches an user-related action, this reducer will change the 
 * state in relation to the action type and content.
 */

const USER_TYPE_KEYS = {
  PROGRAMMER: 'developer',
  CLIENT: 'client',
  TECHNICAL_AREA_MANAGER: 'repre_technical',
  REVISION_OFFICE_MANAGER: 'repre_revision'
};

export const USER_TYPE_IDS = {
  PROGRAMMER: 0,
  TECHNICAL_AREA_MANAGER: 1,
  REVISION_OFFICE_MANAGER: 2,
  CLIENT: 3
}

export const initialState = {
  id: null,
  name: null,
  area: null,
  email: null,
  role: mapRoleArrayToRoleObject([]),
  obtainingInfo: true
};

/**
 * The server API gives us an array containing the strings corresponding to user's roles
 * This functions maps the role array into an object used in the state for faster accessing
 * @param roleArray The array containing roles keys
 */
function mapRoleArrayToRoleObject(roleArray) {
  let roleObject = {
    isProgrammer: false,
    isClient: false,
    isTechnicalAreaManager: false,
    isRevisionOfficeManager: false
  };

  roleArray.forEach(element => {
    switch (element) {
      case USER_TYPE_KEYS.PROGRAMMER:
        roleObject.isProgrammer = true;
        break;
      case USER_TYPE_KEYS.CLIENT:
        roleObject.isClient = true;
        break;
      case USER_TYPE_KEYS.TECHNICAL_AREA_MANAGER:
        roleObject.isTechnicalAreaManager = true;
        break;
      case USER_TYPE_KEYS.REVISION_OFFICE_MANAGER:
        roleObject.isRevisionOfficeManager = true;
        break;
      default:
        console.warn(`User has an unrecognized role: ${element}`);
        break;
    }
  });

  return roleObject;
}

export function user(state = initialState, action) {
  switch (action.type) {
    case USER_ACTION_TYPE_KEYS.USER_INFO_REQUESTED:
      console.log("Requesting user info...");
      return {
        obtainingInfo: true,
        ...state
      };
    case USER_ACTION_TYPE_KEYS.UNABLE_TO_GET_USER_INFO:
      console.log("User info received");
      return {
        obtainingInfo: false,
        id: 'ERROR',
        name: 'ERROR',
        area: 'ERROR',
        email: 'ERROR',
        ...state
      };
    case USER_ACTION_TYPE_KEYS.USER_INFO_OBTAINED:
      console.log("User info received");
      return {
        obtainingInfo: false,
        id: action.payload.response_data.user_id,
        name: action.payload.response_data.name,
        area: action.payload.response_data.area,
        email: action.payload.response_data.email,
        role: mapRoleArrayToRoleObject(action.payload.response_data.role)
      };
    default:
      return state;
  }
}
