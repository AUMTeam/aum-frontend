import { put, select } from 'redux-saga/effects';
import {
  makeAuthenticatedApiRequest,
  makeUnauthenticatedApiRequest,
  getUIMessageForErrorString
} from '../../utils/apiUtils';
import { AUTH_ACTION_TYPE } from '../actions/auth';
import { REQUEST_TIMEOUT_MS } from '../../constants/api';

/**
 * These classes allow us to perform API requests in Saga in a much cleaner and more elegant way,
 * hiding the complexity of makeRequestAndReportErrors() (see below).
 */

/* abstract */ class ApiRequest {
  constructor(requestPath) {
    this.requestPath = requestPath;
  }

  setRequestData(requestData) {
    this.requestData = requestData;
    return this;
  }

  setErrorAction(errorAction) {
    this.errorAction = errorAction;
    return this;
  }

  /* abstract *makeAndReportErrors(); */
  /* abstract *makeWithTimeoutAndReportErrors(); */
}

export class AuthenticatedApiRequest extends ApiRequest {
  *makeAndReportErrors() {
    const accessToken = yield getAccessTokenFromState();
    return yield makeRequestAndReportErrors(this.requestPath, this.requestData, this.errorAction, accessToken);
  }

  *makeWithTimeoutAndReportErrors() {
    const accessToken = yield getAccessTokenFromState();
    return yield makeRequestAndReportErrors(
      this.requestPath,
      this.requestData,
      this.errorAction,
      accessToken,
      REQUEST_TIMEOUT_MS
    );
  }
}

export class UnauthenticatedApiRequest extends ApiRequest {
  *makeAndReportErrors() {
    return yield makeRequestAndReportErrors(this.requestPath, this.requestData, this.errorAction);
  }

  *makeWithTimeoutAndReportErrors() {
    return yield makeRequestAndReportErrors(
      this.requestPath,
      this.requestData,
      this.errorAction,
      null,
      REQUEST_TIMEOUT_MS
    );
  }
}

function* getAccessTokenFromState() {
  const accessToken = yield select(state => state.auth.accessToken);
  // prettier-ignore
  if (accessToken == null)
    throw new Error('User must be logged in to perform an authenticated request.');

  return accessToken;
}

/**
 * Performs an API request to the specified path, dispatching the given Redux action in case of errors
 * with an errorMessage attribute injected in it.
 * Dispatches a SESSION_EXPIRED action when the server responds with code 401 (unauthorized)
 * to an authenticated request, which means that the token is expired.
 * Returns null if there were any errors, otherwise the parsed response data object.
 */
function* makeRequestAndReportErrors(
  requestPath,
  requestData = null,
  errorAction = null,
  accessToken = null,
  timeoutInMilliseconds = 0
) {
  let response;
  // prettier-ignore
  if (accessToken == null)
    response = yield makeUnauthenticatedApiRequest(requestPath, requestData, timeoutInMilliseconds);
  else
    response = yield makeAuthenticatedApiRequest(requestPath, accessToken, requestData, timeoutInMilliseconds);

  if (response == null) {
    yield put({ ...errorAction, errorMessage: 'Richiesta al server fallita, possibile problema di connessione' });
    return null;
  }

  const responseJson = yield parseResponseJsonAndReportError(response, errorAction);
  // prettier-ignore
  if (responseJson == null)
    return null;

  // prettier-ignore
  if (!response.ok) {
    if (accessToken != null && response.status === 401)
      yield put({ type: AUTH_ACTION_TYPE.SESSION_EXPIRED });
    else if (errorAction != null)
      yield put({ ...errorAction, errorMessage: getUIMessageForErrorString(responseJson.error) });

    console.error(`Server responded with ${responseJson.error} to ${requestPath} request: ${responseJson.message}`);
    return null;
  }

  return responseJson.response_data;
}

function* parseResponseJsonAndReportError(response, errorAction) {
  try {
    const responseJson = yield response.json();
    return responseJson;
  } catch (err) {
    yield put({
      ...errorAction,
      errorMessage:
        "È stata ricevuta una risposta contenente dati errati dal server. Contatta l'amministratore di sistema."
    });
    console.error('Error when parsing JSON response from server: ', err);
    return null;
  }
}
