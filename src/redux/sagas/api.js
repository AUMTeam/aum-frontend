import { call, put, select } from 'redux-saga/effects';
import { makeAuthenticatedApiRequest, makeUnauthenticatedApiRequest } from '../../utils/apiUtils';
import { AUTH_ACTION_TYPE } from '../actions/auth';

/**
 * Performs an authenticated API request to the specified path, dispatching the given Redux action in case of errors
 * with an errorMessage attribute injected in it.
 * Also dispatches by default a SESSION_EXPIRED action when the server responds with code 401 (unauthorized),
 * which means that the token is expired.
 * Returns null if there were any errors, otherwise the parsed response data object.
 */
export function* makeAuthenticatedRequestAndReportErrors(requestPath, errorAction = null, requestData = null) {
  const accessToken = yield select(state => state.auth.accessToken);
  if (accessToken == null)
    throw new Error('User must be logged in to perform an authenticated request.');
  
  return yield makeRequestAndReportErrors(requestPath, errorAction, requestData, accessToken);
}

/**
 * Like the method above, but for unauthenticated API requests (without token)
 */
export function* makeUnauthenticatedRequestAndReportErrors(requestPath, requestData = null, errorAction = null) {
  return yield makeRequestAndReportErrors(requestPath, errorAction, requestData);
}

function* makeRequestAndReportErrors(requestPath, errorAction = null, requestData = null, accessToken = null) {
  let response;
  if (accessToken == null)
    response = yield call(makeUnauthenticatedApiRequest, requestPath, requestData);
  else
    response = yield call(makeAuthenticatedApiRequest, requestPath, accessToken, requestData);

  if (response == null) {
    yield put({ ...errorAction, errorMessage: 'Richiesta al server fallita, possibile problema di connessione' });
    return null;
  }

  const responseJson = yield parseResponseJsonAndReportError(response, errorAction);
  if (responseJson == null)
    return null;

  if (!response.ok) {
    if (accessToken != null && response.status === 401)
      yield put({ type: AUTH_ACTION_TYPE.SESSION_EXPIRED });
    else if (errorAction != null)
      yield put({ ...errorAction, errorMessage: responseJson.message });

    console.error(`Server responded with an error to ${requestPath} request: ${responseJson.message}`);
    return null;
  }

  return responseJson.response_data;
}

function* parseResponseJsonAndReportError(response, errorAction) {
  try {
    const responseJson = yield call([response, response.json])
    return responseJson;
  }
  catch (err) {
    yield put({
      ...errorAction,
      errorMessage: "È stata ricevuta una risposta contenente dati errati dal server. Contatta l'amministratore di sistema."
    });
    console.error('Error when parsing JSON response from server: ', err);
    return null;
  }
}
