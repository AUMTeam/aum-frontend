/**
 * @file
 * This file contains all the action creators used to get or manipulate user data.
 */

export const USER_ACTION_TYPE_KEYS = {
  GET_CURRENT_USER_INFO_REQUEST: 'GET_CURRENT_USER_INFO_REQUEST',
  GET_CURRENT_USER_INFO_SUCCESSFUL: 'GET_CURRENT_USER_INFO_SUCCESSFUL',
  GET_CURRENT_USER_INFO_FAILED: 'GET_CURRENT_USER_INFO_FAILED'
};

export function requestCurrentUserInfoAction(accessToken) {
  return {
    type: USER_ACTION_TYPE_KEYS.GET_CURRENT_USER_INFO_REQUEST,
    accessToken
  };
}
