/* eslint-disable default-case */
/**
 * @file
 * This file contains helper functions used for API requests.
 */
import { API_ENDPOINT_URL, TOKEN_LOCALSTORAGE_KEY, AUTH_ERROR_STRING } from '../constants/api';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

export function makeUnauthenticatedApiRequest(requestPath, requestData = {}, timeoutInMilliseconds = 0) {
  return makeApiRequest(requestPath, requestData, timeoutInMilliseconds);
}

export function makeAuthenticatedApiRequest(requestPath, accessToken, requestData = {}, timeoutInMilliseconds = 0) {
  return makeApiRequest(requestPath, requestData, timeoutInMilliseconds, accessToken);
}

function makeApiRequest(requestPath, requestData, timeoutInMilliseconds, accessToken = null) {
  const requestUrl = `${API_ENDPOINT_URL}/${requestPath}`;
  const init = buildFetchInitParameter(requestData, accessToken);

  let fetchPromise;
  // prettier-ignore
  if (timeoutInMilliseconds > 0)
    fetchPromise = fetchWithTimeout(requestUrl, init, timeoutInMilliseconds);
  else
    fetchPromise = fetch(requestUrl, init);

  return fetchPromise.catch(error => {
    printRequestErrorMessage(error, requestPath);
    return null;
  });
}

function buildFetchInitParameter(requestData, accessToken) {
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken != null)
    headers['X-Auth-Header'] = accessToken;

  return {
    method: 'POST',
    headers,
    body: JSON.stringify({ request_data: requestData })
  };
}

function fetchWithTimeout(requestUrl, init, timeoutInMilliseconds) {
  const abortController = new AbortController();
  const abortSignal = abortController.signal;

  setTimeout(() => abortController.abort(), timeoutInMilliseconds);

  return fetch(requestUrl, { ...init, signal: abortSignal });
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
  return elementType + `/${requestType}`;
}

export function getUIMessageForErrorString(errorString) {
  switch (errorString) {
    case AUTH_ERROR_STRING.INVALID_CREDENTIALS:
      return 'Credenziali non valide';
    default:
      return errorString;
  }
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
