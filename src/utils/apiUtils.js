/**
 * @file
 * This file contains helper functions used for API requests.
 */
import { API_ENDPOINT_URL, REQUEST_TIMEOUT_MS, TOKEN_LOCALSTORAGE_KEY, LIST_ELEMENTS_TYPE } from '../constants/api';
import { LIST_ELEMENT_ATTRIBUTE } from '../constants/listElements';

/**
 * Returns a promise that is rejected after the specified timeout
 * @param {*} timeoutInMilliseconds Timeout in ms
 * @param {*} promise The promise which has to be completed before the timeout
 */
function withTimeout(timeoutInMilliseconds, promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutInMilliseconds))
  ]);
}

/**
 * Makes a request to the server without passing the access token in the headers
 * Intended for those actions that don't require authentication
 * Promise returns null if the request fails for whatever reason
 * @param {*} actionPath One of the paths defined in REQUEST_ACTIONS_PATH
 * @param {*} requestData The object containing the request data (optional for an empty object)
 */
export function makeUnauthenticatedApiRequest(actionPath, requestData = {}) {
  return withTimeout(
    REQUEST_TIMEOUT_MS,
    fetch(`${API_ENDPOINT_URL}/${actionPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_data: requestData })
    })
  ).catch(error => {
    console.error(error, `occurred during unauthenticated API request to ${actionPath}`);
    return null;
  });
}

/**
 * Makes a request to the server passing the access token in the headers
 * Used for those actions that need user authentication
 * Promise returns null if the request fails for whatever reason
 * @param {*} actionPath One of the paths defined in REQUEST_ACTIONS_PATH
 * @param {*} requestData The object containing the request data (optional for an empty object)
 */
export function makeAuthenticatedApiRequest(actionPath, accessToken, requestData = {}) {
  return withTimeout(
    REQUEST_TIMEOUT_MS,
    fetch(`${API_ENDPOINT_URL}/${actionPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Header': accessToken
      },
      body: JSON.stringify({ request_data: requestData })
    })
  ).catch(error => {
    console.error(error, `occurred during authenticated API request to ${actionPath}`);
    return null;
  });
}

/**
 * Gets the filter object corresponding to the given search term.
 * The filter logic is common so we can change the behavior globally without any inconsistencies
 * @param {*} searchQuery the searched term
 */
export function getSearchFilter(searchQuery) {
  if (searchQuery != null && searchQuery !== '')
    return {
      attribute: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION,
      valueMatches: searchQuery
    }
  else
    return {};
}

/**
 * Gets the API relative path to make a specified operation on the list of the given type
 * @param {*} elementType One of the elements contained in LIST_ELEMENTS_TYPE
 * @param {*} requestType One of the following: add, list, update, approve
 */
export function getListRequestPath(elementType, requestType)
{
  let requestPath = '';
  switch (elementType)
  {
    case LIST_ELEMENTS_TYPE.COMMITS:
      requestPath += 'commit';
      break;
    case LIST_ELEMENTS_TYPE.SEND_REQUESTS:
      requestPath += 'requests';
      break;
    default:
      break;
  }
  return requestPath + `/${requestType}`;
}

export function saveAccessTokenToLocalStorage(accessToken) {
  console.log('Saving access token to local storage');
  try {
    localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, accessToken);
  } catch (err) {
    console.error(`Unable to save access token in local storage: ${err}`);
  }
}

export function removeAccessTokenFromLocalStorage() {
  console.log('Removing access token from local storage');
  try {
    localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
  } catch (err) {
    console.error(`Unable to remove access token from local storage: ${err}`);
  }
}
