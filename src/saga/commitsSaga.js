import { takeLatest } from 'redux-saga';
import { select, call, put } from 'redux-saga/effects';
import { COMMITS_ACTION_TYPE_KEYS, COMMITS_PER_PAGE } from '../actions/commits';
import { REQUEST_ACTIONS_PATHS, makeAuthenticatedApiRequest } from '../utils/apiUtils';

/**
 * Called every time the user changes the page of the commits table or the latter is recreated
 * Retrieves the list of commits for the requested page
 * Commits are retrieved from server only when the requested page is not present locally or
 * local data is not up to date anymore
 * @param {*} action Action of type COMMITS_LIST_PAGE_REQUEST
 */
function* retrieveCommitsListPage(action) {
  // TODO UPDATE CHECKING
  const commitsListPages = yield select(state => state.commits.listPages);
  const requestedPageAlreadyFetched = action.pageNumber in commitsListPages;
  if (requestedPageAlreadyFetched) {
    const latestCommitTimestamp = yield select(state => state.commits.latestCommitTimestamp);
    var requestedPageNotUpdated =
      commitsListPages[action.pageNumber].updateTimestamp < latestCommitTimestamp;
  }

  if (!requestedPageAlreadyFetched || requestedPageNotUpdated) {
    const { serverResponse, errorMessage } = yield call(
      fetchCommitsListPageFromServer,
      action.pageNumber
    );
    
    if (errorMessage != null) {
      console.error(`Unable to get data for commits page ${action.pageNumber}: ${errorMessage}`);
      yield put({
        type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_RETRIEVAL_ERROR,
        errorMessage
      });
    }
    else {
      yield put({
        type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_RETRIEVED_FROM_SERVER,
        serverResponse,
        pageNumber: action.pageNumber
      });
    }
  }
  else {
    yield put({ type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_NO_RETRIEVAL_NEEDED });
  }
}

/**
 * Fetches the commits for a given page number from the server
 * @param {*} pageNumber The page requested
 */
function* fetchCommitsListPageFromServer(pageNumber) {
  const response = yield makeAuthenticatedApiRequest(
    REQUEST_ACTIONS_PATHS.GET_COMMITS_LIST,
    yield select(state => state.auth.accessToken),
    {
      page: pageNumber,
      limit: COMMITS_PER_PAGE
    }
  );

  const responseJson = yield response.json();
  if (response.ok)
    return {
      serverResponse: responseJson.response_data,
      errorMessage: null
    };
  else
    return {
      serverResponse: null,
      errorMessage: responseJson.message
    };
}

export const commitsSaga = [
  takeLatest(COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_REQUEST, retrieveCommitsListPage)
];
