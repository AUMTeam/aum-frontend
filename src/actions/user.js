import { API_ENDPOINT_URL } from '.';
import { RSAA } from 'redux-api-middleware';

/**
 * @file
 * This file contains all the actions used to get or manipulate user data.
 */

export const USER_ACTION_TYPE_KEYS = {
  GET_USER_INFO_REQUEST: 'GET_USER_INFO_REQUEST',
  GET_USER_INFO_SUCCESSFUL: 'GET_USER_INFO_SUCCESSFUL',
  GET_USER_INFO_FAILED: 'GET_USER_INFO_FAILED'
};

export function getUserInfo(accessToken) {
  return {
    [RSAA]: {
      endpoint: `${API_ENDPOINT_URL}/user/info`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Header': accessToken
      },
      body: JSON.stringify({
        request_data: {}
      }),
      types: [
        USER_ACTION_TYPE_KEYS.GET_USER_INFO_REQUEST,
        USER_ACTION_TYPE_KEYS.GET_USER_INFO_SUCCESSFUL,
        USER_ACTION_TYPE_KEYS.GET_USER_INFO_FAILED
      ]
    }
  };
}
