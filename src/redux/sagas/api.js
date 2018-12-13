import { put } from 'redux-saga/effects';
import { makeAuthenticatedApiRequest, makeUnauthenticatedApiRequest } from '../../utils/apiUtils';
import { AUTH_ACTION_TYPE } from '../actions/auth';

/**
 * 
 * @param {*} requestPath 
 * @param {*} errorAction 
 * @param {*} requestData 
 * @param {*} accessToken 
 * @param {*} dispatchExpiredTokenAction 
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
    response = yield makeUnauthenticatedApiRequest(requestPath, requestData);
  else
    response = yield makeAuthenticatedApiRequest(requestPath, accessToken, requestData);

  if (response == null) {
    yield put({ ...errorAction, errorMessage: 'Richiesta al server fallita, possibile problema di connessione' });
    return null;
  }

  let responseJson;
  try {
    responseJson = yield response.json();
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
