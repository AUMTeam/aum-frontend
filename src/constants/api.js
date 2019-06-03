export let API_ENDPOINT_URL = 'https://aum.altervista.org/main.php';
export const TOKEN_LOCALSTORAGE_KEY = 'token';

export const REQUEST_TIMEOUT_MS = 8000;
export const LIST_AUTO_UPDATE_INTERVAL_MS = 5000;
export const LIST_ELEMENTS_PER_PAGE = 20;

export const SEARCH_DEBOUNCE_DELAY_MS = 250;

export const ELEMENT_TYPE = {
  COMMITS: 'commits',
  SEND_REQUESTS: 'sendRequests',
  CLIENTS: 'clients',
  BRANCHES: 'branches'
}

export const ELEMENT_ENDPOINT_TYPE = {
  ADD: 'add',
  LIST: 'list',
  SHORT_LIST: 'shortList',
  UPDATE: 'update',
  REMOVE: 'remove'
}

export const REQUEST_ENDPOINT_PATH = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  VALIDATE_TOKEN: 'auth/validateToken',
  GET_USER_INFO: 'user/info'
};

export const API_ERROR_STRING = {
  MISSING_TOKEN: 'ERROR_GLOBAL_MISSING_TOKEN',
  INVALID_TOKEN: 'ERROR_GLOBAL_INVALID_TOKEN',
  INVALID_REQUEST: 'ERROR_GLOBAL_INVALID_REQUEST',
  INVALID_CREDENTIALS: 'ERROR_LOGIN_INVALID_CREDENTIALS',
  UNAUTHORIZED: 'ERROR_GLOBAL_UNAUTHORIZED',
  DB_ERROR: 'ERROR_GLOBAL_DB',
  NOT_IMPLEMENTED: 'ERROR_GLOBAL_NOT_IMPLEMENTED',
  USER_NOT_FOUND: 'ERROR_USER_NOT_FOUND',
  INVALID_ID: 'ERROR_INVALID_ID',
  REQUEST_NOT_JSON: 'ERROR_REQUEST_NOT_JSON',
  REMOVE_COMMIT_ALREADY_INCLUDED: 'ERROR_REMOVE_COMMIT_ALREADY_INCLUDED',
  SERVER_IN_MAINTENANCE: 'ERROR_SRV_IN_MAINTENANCE',
  LIST_INVALID_PARAMETER: 'ERROR_LIST_INVALID_PARAMETER'
};

// Used only in dev code for test purposes, should never be called in production!
export function changeEndpointUrl(newUrl) {
  API_ENDPOINT_URL = newUrl;
  console.log(`API endpoint changed to ${API_ENDPOINT_URL}`);
  if (!API_ENDPOINT_URL.startsWith('https://'))
    console.warn('You are not using a secure protocol for API connection. Data can be easily intercepted!');
}
