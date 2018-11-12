import { takeLatest } from 'redux-saga';
import { select, call } from 'redux-saga/effects';
import { COMMITS_ACTION_TYPE_KEYS } from '../actions/commits';
import {
    REQUEST_ACTIONS_PATHS,
    makeAuthenticatedApiRequest
} from '../utils/apiUtils';


/**
 * Called every time the user changes the page of the commits table
 * @param {*} action Action of type COMMITS_LIST_PAGE_REQUEST
 */
function* retrieveCommitsListPage(action) {
  const commitsListPages = yield select(state => state.commits.listPages);
  const requestedPageAlreadyFetched = action.pageNumber in commitsListPages;
  if (requestedPageAlreadyFetched) {
    const latestUpdateTimestamp = yield select(state => state.commits.latestUpdateTimestamp);
    var requestedPageNotUpdated = commitsListPages[action.pageNumber].updateTimestamp < latestUpdateTimestamp;
  }

  if (!requestedPageAlreadyFetched || requestedPageNotUpdated) {
    const { pageData, errorMessage } = yield call(fetchCommitsListPageFromServer, action.pageNumber);
    // TODO
  }
}

/**
 * Fetches the commits for a given page number from the server
 * @param {*} pageNumber The page requested
 */
function* fetchCommitsListPageFromServer(pageNumber) {
    // TODO
}

export const commitsSaga = [
  takeLatest(COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_REQUEST, retrieveCommitsListPage)
];
