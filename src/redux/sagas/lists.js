import { delay } from 'redux-saga';
import { call, cancel, cancelled, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { LIST_AUTO_UPDATE_INTERVAL, LIST_ELEMENTS_PER_PAGE, LIST_ELEMENTS_TYPE } from '../../constants/api';
import { makeAuthenticatedApiRequest, getListRequestPath } from '../../utils/apiUtils';
import { LIST_ACTION_TYPE } from '../actions/lists';

/**
 * Called every time the user changes the page of the commits table or the latter is recreated
 * Retrieves the list of commits for the requested page
 * Commits are retrieved from server only when the requested page is not present locally or
 * local data is not up to date anymore
 * @param {*} action Action of type PAGE_REQUEST
 */
function* retrieveListPage(action) {
  yield call(
    checkForListUpdates,
    yield select(state => state[action.userRoleString][action.elementType].latestUpdateTimestamp),
    action
  );

  const listPages = yield select(state => state[action.userRoleString][action.elementType].listPages);
  const requestedPageAlreadyFetched = action.pageNumber in listPages;
  if (requestedPageAlreadyFetched) {
    const latestUpdateTimestamp = yield select(
      state => state[action.userRoleString].commits.latestUpdateTimestamp
    );
    var requestedPageNotUpdated = listPages[action.pageNumber].updateTimestamp < latestUpdateTimestamp;
    var sortingCriteriaDifferent =
      action.sortingCriteria.columnKey !== listPages[action.pageNumber].sorting.columnKey ||
      action.sortingCriteria.direction !== listPages[action.pageNumber].sorting.direction;
  }

  // Fetch page only if needed
  if (!requestedPageAlreadyFetched || requestedPageNotUpdated || sortingCriteriaDifferent) {
    const { serverResponse, errorMessage } = yield call(
      fetchListPageFromServer,
      action
    );

    if (errorMessage != null) {
      console.error(`Unable to get data for list page ${action.pageNumber}: ${errorMessage}`);
      yield put({
        type: LIST_ACTION_TYPE.PAGE_RETRIEVAL_ERROR,
        elementType: action.elementType,
        userRoleString: action.userRoleString,
        errorMessage
      });
    } else {
      yield put({
        type: LIST_ACTION_TYPE.PAGE_RETRIEVED_FROM_SERVER,
        elementType: action.elementType,
        userRoleString: action.userRoleString,
        serverResponse,
        pageNumber: action.pageNumber,
        sortingCriteria: action.sortingCriteria
      });
    }
  } else {
    yield put({
      type: LIST_ACTION_TYPE.NO_RETRIEVAL_NEEDED,
      elementType: action.elementType,
      userRoleString: action.userRoleString
    });
  }
}

/**
 * Fetches the elements for a given page number from the server
 * @param {*} action Action of type PAGE_REQUEST
 */
function* fetchListPageFromServer(action) {
  const response = yield makeAuthenticatedApiRequest(
    getListRequestPath(action.elementType, 'list'),
    yield select(state => state.auth.accessToken),
    action.sortingCriteria.columnKey == null ? {
      page: action.pageNumber,
      limit: LIST_ELEMENTS_PER_PAGE
    } : {
      page: action.pageNumber,
      limit: LIST_ELEMENTS_PER_PAGE,
      sort: {
        parameter: action.sortingCriteria.columnKey,
        order: action.sortingCriteria.direction
      }
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
 * Checks if there have been any server-side updates to the list by
 * sending the timestamp of the latest retrieved element.
 * It updates the state accordingly if the server confirms the presence of updates
 * @param {*} latestUpdateTimestamp timestamp of the latest retrieved element
 * @param {*} action Action of type START_AUTO_CHECKING or PAGE_REQUEST
 */
function* checkForListUpdates(latestUpdateTimestamp, action) {
  const response = yield makeAuthenticatedApiRequest(
    getListRequestPath(action.elementType, 'update'),
    yield select(state => state.auth.accessToken),
    {
      latest_update_timestamp: latestUpdateTimestamp
    }
  );

  if (response != null) {
    const responseJson = yield response.json();
    if (response.ok) {
      yield put({
        type: LIST_ACTION_TYPE.UPDATE_RECEIVED,
        userRoleString: action.userRoleString,
        elementType: action.elementType,
        latestUpdateTimestamp: responseJson.response_data.latest_update_timestamp,
        updatesFound: responseJson.response_data.updates_found
      });

      if (!responseJson.response_data.updates_found)
        console.log(`No ${action.elementType} list updates found`);
    }
    else {
      yield put({
        type: LIST_ACTION_TYPE.UPDATE_CHECKING_ERROR,
        elementType: action.elementType,
        userRoleString: action.userRoleString
      });
      console.error(
        `Server responded with an error when checking for ${action.elementType} list updates: ${responseJson.message}`
      );
    }
  }
  else {
    yield put({
      type: LIST_ACTION_TYPE.UPDATE_CHECKING_ERROR,
      elementType: action.elementType,
      userRoleString: action.userRoleString
    });
    console.error(`An error occurred during ${action.elementType} list update check request to server`);
  }
}

// Contains the auto update checking tasks corresponding to the lists of the specified element type,
// so that they can be started and stopped from different functions (see below).
// This assumes that there can't be more than a list for the same element type in the same view
let autoUpdateTasks = {
  [LIST_ELEMENTS_TYPE.COMMITS]: null,
  [LIST_ELEMENTS_TYPE.SEND_REQUESTS]: null
};

/**
 * Performs automatic update checking for the list
 * every LIST_AUTO_UPDATE_INTERVAL milliseconds
 * @param {*} action Action of type START_AUTO_CHECKING
 */
function* runListUpdateChecker(action) {
  try {
    console.log(`Auto update checking started for ${action.elementType} list`);
    while (true) {
      yield delay(LIST_AUTO_UPDATE_INTERVAL);
      // Avoid checking for updates when the state of the list is not yet initialized
      // or when retrieveListPage() is running
      if ((yield select(state => state[action.userRoleString][action.elementType] != null)) &&
          (yield select(state => !state[action.userRoleString][action.elementType].isLoadingList))) {
        console.log(`Checking for ${action.elementType} list updates...`);
        yield call(
          checkForListUpdates,
          yield select(state => state[action.userRoleString][action.elementType].latestUpdateTimestamp),
          action
        );
      }
    }
  } finally {
    if (yield cancelled())
      console.log(`Auto update checking stopped for ${action.elementType} list`);
    else
      console.error(`Unexpected error during ${action.elementType} list auto updating`);
  }
}

function* updateCheckingTasksRunner() {
  while (true) {
    const action = yield take(LIST_ACTION_TYPE.START_AUTO_CHECKING);
    if (autoUpdateTasks[action.elementType] == null)
      autoUpdateTasks[action.elementType] = yield fork(() => runListUpdateChecker(action));
    else
      console.error(`There is another update checking task running for element type ${action.elementType}`);
  }
}

function* updateCheckingTasksStopper() {
  while (true) {
    const action = yield take(LIST_ACTION_TYPE.STOP_AUTO_CHECKING);
    if (autoUpdateTasks[action.elementType] != null) {
      yield cancel(autoUpdateTasks[action.elementType]);
      autoUpdateTasks[action.elementType] = null;
    }
    else
      console.error('Tried to stop an unexisting update checking task.');
  }
}

export const listsSaga = [
  updateCheckingTasksRunner(),
  updateCheckingTasksStopper(),
  takeLatest(LIST_ACTION_TYPE.PAGE_REQUEST, retrieveListPage)
];
