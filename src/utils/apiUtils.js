/* eslint-disable default-case */
/**
 * @file
 * This file contains helper functions used for API requests.
 */
import { API_ENDPOINT_URL, TOKEN_LOCALSTORAGE_KEY, API_ERROR_STRING } from '../constants/api';
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
    case API_ERROR_STRING.DB_ERROR:
      return "Errore interno del server. Contatta l'amministratore di sistema.";
    case API_ERROR_STRING.INVALID_REQUEST:
      return 'Richiesta non valida. Assicurati che tutti i campi siano presenti.';
    case API_ERROR_STRING.INVALID_CREDENTIALS:
      return 'Credenziali non valide.';
    case API_ERROR_STRING.UNAUTHORIZED:
      return "Non sei autorizzato ad effettuare l'operazione.";
    case API_ERROR_STRING.INVALID_ID:
      return "L'operazione non può essere effettuata sull'elemento specificato.";
    case API_ERROR_STRING.REMOVE_COMMIT_ALREADY_INCLUDED:
      return 'Il commit è già referenziato in una richiesta di invio.';
    case API_ERROR_STRING.APPROVE_ALREADY_APPROVED:
    case API_ERROR_STRING.REMOVE_ALREADY_APPROVED:
      return "L'elemento è già stato revisionato.";
    case API_ERROR_STRING.SEND_NOT_APPROVED:
      return 'La richiesta non è ancora stata approvata.';
    case API_ERROR_STRING.INSTALL_NOT_SENT:
      return "L'aggiornamento non è ancora stato inviato.";
    case API_ERROR_STRING.LIST_INVALID_PARAMETER:
      return 'Parametri di filtraggio della lista non validi.';
    case API_ERROR_STRING.SERVER_IN_MAINTENANCE:
      return 'Il server è in manutenzione. Riprova più tardi.';
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
