/* eslint-disable default-case */
/**
 * @file
 * This file contains helper functions used for API requests.
 */
import { API_ENDPOINT_URL, ELEMENT_TYPE, REQUEST_TIMEOUT_MS, TOKEN_LOCALSTORAGE_KEY } from '../constants/api';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

function fetchWithTimeout(requestUrl, init, timeoutInMilliseconds) {
  const abortController = new AbortController();
  const abortSignal = abortController.signal;

  setTimeout(() => abortController.abort(), timeoutInMilliseconds);

  return fetch(requestUrl, { ...init, signal: abortSignal });
}

/**
 * Makes a request to the server without passing the access token in the headers
 * Intended for those actions that don't require authentication
 * Promise returns null if the request fails for whatever reason
 */
export function makeUnauthenticatedApiRequest(relativeRequestPath, requestData = {}) {
  return fetchWithTimeout(
    `${API_ENDPOINT_URL}/${relativeRequestPath}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_data: requestData })
    },
    REQUEST_TIMEOUT_MS
  ).catch(error => {
    printRequestErrorMessage(error, relativeRequestPath);
    return null;
  });
}

/**
 * Makes a request to the server passing the access token in the headers
 * Used for those actions that need user authentication
 * Promise returns null if the request fails for whatever reason
 */
export function makeAuthenticatedApiRequest(relativeRequestPath, accessToken, requestData = {}) {
  return fetchWithTimeout(
    `${API_ENDPOINT_URL}/${relativeRequestPath}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Header': accessToken
      },
      body: JSON.stringify({ request_data: requestData })
    },
    REQUEST_TIMEOUT_MS
  ).catch(error => {
    printRequestErrorMessage(error, relativeRequestPath);
    return null;
  });
}

// prettier-ignore
function printRequestErrorMessage(error, requestPath) {
  if (error.name === 'AbortError')
    console.error(`API request to ${requestPath} aborted due to timeout`);
  else
    console.error(error, `occurred during API request to ${requestPath}`);
}

/**
 * Gets the API relative path to make a specified operation on the list of the given type
 * @param {*} elementType One of the elements contained in ELEMENT_TYPE
 * @param {*} requestType One of the following: add, list, update, approve
 */
export function getRequestPath(elementType, requestType) {
  let requestPath = '';

  switch (elementType) {
    case ELEMENT_TYPE.SEND_REQUESTS:
      requestPath += 'sendRequest';
      break;
    case ELEMENT_TYPE.COMMITS:
      requestPath += 'commit';
      break;
    case ELEMENT_TYPE.DATA:
      requestPath += 'data';
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
