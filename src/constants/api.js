export let API_ENDPOINT_URL = 'https://aum.altervista.org/main.php';
export const TOKEN_LOCALSTORAGE_KEY = 'token';

export const REQUEST_TIMEOUT_MS = 7000;
export const LIST_AUTO_UPDATE_INTERVAL = 10000;
export const LIST_ELEMENTS_PER_PAGE = 20;

export const SEARCH_DEBOUNCE_DELAY_MS = 500;

export const LIST_ELEMENTS_TYPE = {
  COMMITS: 'commits',
  SEND_REQUESTS: 'sendRequests'
}

export const REQUEST_ACTIONS_PATH = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  VALIDATE_TOKEN: 'auth/validateToken',
  GET_USER_INFO: 'user/info'
};

// Used only in dev code for test purposes, should never be called in production!
export function changeEndpointUrl(newUrl) {
  API_ENDPOINT_URL = 'https://' + newUrl;
  console.log(`API endpoint changed to ${API_ENDPOINT_URL}`);
}