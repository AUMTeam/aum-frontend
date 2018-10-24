import { API_ENDPOINT_URL } from '.';
import { RSAA } from 'redux-api-middleware';

/**
 * @file
 * This file contains all the actions used to get or manipulate user data.
 */

export const USER_ACTION_TYPE_KEYS = {
  USER_INFO_REQUESTED: 'USER_INFO_REQUESTED',
  USER_INFO_OBTAINED: 'USER_INFO_OBTAINED',
  UNABLE_TO_GET_USER_INFO: 'UNABLE_TO_GET_USER_INFO'
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
        USER_ACTION_TYPE_KEYS.USER_INFO_REQUESTED,
        USER_ACTION_TYPE_KEYS.USER_INFO_OBTAINED,
        USER_ACTION_TYPE_KEYS.UNABLE_TO_GET_USER_INFO
      ]
    }
  };
}
