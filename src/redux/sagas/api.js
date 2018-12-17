import { call, put } from 'redux-saga/effects';
import { makeAuthenticatedApiRequest, makeUnauthenticatedApiRequest } from '../../utils/apiUtils';
import { AUTH_ACTION_TYPE } from '../actions/auth';

/**
 * Performs an API request to the specified path, dispatching the given Redux action in case of errors
 * with an errorMessage attribute injected in it.
 * Also dispatches by default a SESSION_EXPIRED action when the server responds with code 401 (unauthorized),
 * which means that the token is expired.
 * Returns null if there were any errors, otherwise the parsed response data object.
 * @param {*} requestPath relative path to API endpoint
 * @param {*} errorAction action object to be dispatched in case of error (MUST have a type attribute)
 * @param {*} requestData object with the body of the request (optional)
 * @param {*} accessToken if provided, an authenticated request will be made (optional)
 * @param {*} dispatchExpiredTokenAction default to true, enables the dispatching of a SESSION_EXPIRED action
 *                                       in case of 401 response code
 */
export function* makeRequestAndReportErrors(
  requestPath,
  errorAction,
  requestData = null,
  accessToken = null,
  dispatchExpiredTokenAction = true
) {
  let response;
  if (accessToken == null)
    response = yield call(makeUnauthenticatedApiRequest, requestPath, requestData);
  else
    response = yield call(makeAuthenticatedApiRequest, requestPath, accessToken, requestData);

  if (response == null) {
    yield put({ ...errorAction, errorMessage: 'Richiesta al server fallita, possibile problema di connessione' });
    return null;
  }

  let responseJson;
  try {
    responseJson = yield call([response, response.json]);
  }
  catch (err) {
    yield put({ ...errorAction, errorMessage: "È stata ricevuta una risposta malformata dal server. Contatta l'amministratore di sistema." });
    console.error('Error when parsing JSON response from server: ', err);
    return null;
  }

  if (!response.ok) {
    if (accessToken != null && response.status === 401 && dispatchExpiredTokenAction)
      yield put({ type: AUTH_ACTION_TYPE.SESSION_EXPIRED });
    else
      yield put({ ...errorAction, errorMessage: responseJson.message });

    console.error(`Server responded with an error to ${requestPath} request: ${responseJson.message}`);
    return null;
  }
  else {
    return responseJson.response_data;
  }
}
