import { delay } from 'redux-saga';
import {
  call,
  cancel,
  cancelled,
  fork,
  put,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';
import {
  LIST_AUTO_UPDATE_INTERVAL,
  REQUEST_ACTIONS_PATHS
} from '../../constants/api';
import { makeAuthenticatedApiRequest } from '../../utils/apiUtils';
import { COMMITS_ACTION_TYPE_KEYS } from '../actions/commits';
import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';

/**
 * Called every time the user changes the page of the commits table or the latter is recreated
 * Retrieves the list of commits for the requested page
 * Commits are retrieved from server only when the requested page is not present locally or
 * local data is not up to date anymore
 * @param {*} action Action of type COMMITS_LIST_PAGE_REQUEST
 */
function* retrieveCommitsListPage(action) {
  yield call(
    checkForListUpdates,
    yield select(
      state => state[action.userRoleString].commits.latestCommitTimestamp
    ),
    action.userRoleString
  );

  const commitsListPages = yield select(
    state => state[action.userRoleString].commits.listPages
  );
  const requestedPageAlreadyFetched = action.pageNumber in commitsListPages;
  if (requestedPageAlreadyFetched) {
    const latestCommitTimestamp = yield select(
      state => state[action.userRoleString].commits.latestCommitTimestamp
    );
    var requestedPageNotUpdated =
      commitsListPages[action.pageNumber].updateTimestamp <
      latestCommitTimestamp;
  }

  if (!requestedPageAlreadyFetched || requestedPageNotUpdated) {
    const { serverResponse, errorMessage } = yield call(
      fetchCommitsListPageFromServer,
      action.pageNumber
    );

    if (errorMessage != null) {
      console.error(
        `Unable to get data for commits page ${
          action.pageNumber
        }: ${errorMessage}`
      );
      yield put({
        type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_RETRIEVAL_ERROR,
        errorMessage,
        userRoleString: action.userRoleString
      });
    }
    else {
      yield put({
        type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_RETRIEVED_FROM_SERVER,
        serverResponse,
        pageNumber: action.pageNumber,
        userRoleString: action.userRoleString
      });
    }
  } else {
    yield put({
      type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_NO_RETRIEVAL_NEEDED,
      userRoleString: action.userRoleString
    });
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
      limit: LIST_ELEMENTS_PER_PAGE
    }
  );

  if (response == null)
    return {
      serverResponse: null,
      errorMessage: 'Richiesta al server fallita, possibile problema di connessione'
    };

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

/**
 * Checks if there have been any server-side updates to the commits list by
 * sending the timestamp of the latest retrieved commit.
 * It updates the state accordingly if the server confirms the presence of updates
 * @param {*} latestCommitTimestamp timestamp of the latest retrieved commit
 * @param {*} userRoleString identifies the view (programmer, client etc.) which the
 *                           action to dispatch is related to
 */
function* checkForListUpdates(latestCommitTimestamp, userRoleString) {
  const response = yield makeAuthenticatedApiRequest(
    REQUEST_ACTIONS_PATHS.CHECK_COMMITS_UPDATES,
    yield select(state => state.auth.accessToken),
    { latest_commit_timestamp: latestCommitTimestamp }
  );

  if (response != null) {
    const responseJson = yield response.json();
    if (response.ok) {
      if (responseJson.response_data.updates_found)
        yield put({
          type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_UPDATE_FOUND,
          latestCommitTimestamp: responseJson.response_data.latest_commit_timestamp,
          userRoleString
        });
      else 
        console.log('No commits list updates found');
    }
    else {
      yield put({
        type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_UPDATE_CHECKING_ERROR,
        userRoleString
      });
      console.error(`Server responded with an error when checking for commits list updates: ${responseJson.message}`);
    }
  }
  else {
    yield put({
      type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_UPDATE_CHECKING_ERROR,
      userRoleString
    });
    console.error('An error occurred during commits list update check request to server');
  }
}

/**
 * Performs automatic update checking for the commits list
 * every LIST_AUTO_UPDATE_INTERVAL milliseconds
 * @param {*} action Action of type COMMITS_LIST_START_AUTO_CHECKING
 */
function* runAutoListUpdateChecker(action) {
  try {
    while (true) {
      yield delay(LIST_AUTO_UPDATE_INTERVAL);
      // Avoid checking for updates when retrieveCommitsListPage() is running
      if (
        yield select(
          state => !state[action.userRoleString].commits.isLoadingList
        )
      ) {
        console.log('Checking for commits list updates...');
        yield call(
          checkForListUpdates,
          yield select(
            state => state[action.userRoleString].commits.latestCommitTimestamp
          ),
          action.userRoleString
        );
      }
    }
  } finally {
    if (yield cancelled())
      console.log('Commits list: auto update checking stopped');
    else console.error(`Unexpected error during commits list auto updating`);
  }
}

function* autoListUpdateCheckController() {
  while (true) {
    const action = yield take(
      COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_START_AUTO_CHECKING
    );
    const updateCheckingTask = yield fork(() =>
      runAutoListUpdateChecker(action)
    );
    yield take(COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_STOP_AUTO_CHECKING);
    yield cancel(updateCheckingTask);
  }
}

export const commitsSaga = [
  autoListUpdateCheckController(),
  takeLatest(
    COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_REQUEST,
    retrieveCommitsListPage
  )
];
