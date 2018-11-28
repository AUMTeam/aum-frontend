export const API_ENDPOINT_URL = 'https://aum.altervista.org/main.php';
export const TOKEN_LOCALSTORAGE_KEY = 'token';

export const REQUEST_TIMEOUT_MS = 7000;
export const LIST_AUTO_UPDATE_INTERVAL = 10000;
export const LIST_ELEMENTS_PER_PAGE = 20;

export const REQUEST_ACTIONS_PATH = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  VALIDATE_TOKEN: 'auth/validateToken',
  GET_USER_INFO: 'user/info',
  GET_COMMITS_LIST: 'commit/list',
  CHECK_COMMITS_UPDATES: 'commit/update'
};
