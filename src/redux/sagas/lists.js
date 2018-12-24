import { delay } from 'redux-saga';
import { cancel, cancelled, fork, put, select, take, takeLatest, /* debounce */ } from 'redux-saga/effects';
import { LIST_AUTO_UPDATE_INTERVAL, LIST_ELEMENTS_PER_PAGE, LIST_ELEMENTS_TYPE, SEARCH_DEBOUNCE_DELAY_MS } from '../../constants/api';
import { getListRequestPath } from '../../utils/apiUtils';
import { LIST_ACTION_TYPE } from '../actions/lists';
import { makeRequestAndReportErrors } from './api';

/**
 * Called every time the user changes the page of the commits table or the latter is recreated
 * Retrieves the list of commits for the requested page
 * Commits are retrieved from server only when the requested page is not present locally or
 * local data is not up to date anymore
 * @param {*} action Action of type PAGE_REQUEST
 */
function* retrieveListPage(action) {
  yield checkForListUpdates(
    yield select(state => state[action.userRoleString][action.elementType].latestUpdateTimestamp),
    action
  );

  const listPages = yield select(state => state[action.userRoleString][action.elementType].listPages);
  const requestedPageAlreadyFetched = action.pageNumber in listPages;
  if (requestedPageAlreadyFetched) {
    const latestUpdateTimestamp = yield select(
      state => state[action.userRoleString][action.elementType].latestUpdateTimestamp
    );
    var requestedPageNotUpdated = listPages[action.pageNumber].updateTimestamp < latestUpdateTimestamp;
    var sortingCriteriaDifferent =
      action.sortingCriteria.columnKey !== listPages[action.pageNumber].sorting.columnKey ||
      action.sortingCriteria.direction !== listPages[action.pageNumber].sorting.direction;
  }

  // Fetch page only if needed -- TODO: controllare presenza attributo searchQuery nei dati della page
  if (!requestedPageAlreadyFetched || requestedPageNotUpdated || sortingCriteriaDifferent) {
    const pageResponseData = yield makeRequestAndReportErrors(
      getListRequestPath(action.elementType, 'list'),
      {
        type: LIST_ACTION_TYPE.PAGE_RETRIEVAL_ERROR,
        elementType: action.elementType,
        userRoleString: action.userRoleString
      },
      {
        page: action.pageNumber,
        limit: LIST_ELEMENTS_PER_PAGE,
        sort: action.sortingCriteria.columnKey == null ? {} : {
          parameter: action.sortingCriteria.columnKey,
          order: action.sortingCriteria.direction
        }
      },
      yield select(state => state.auth.accessToken)
    );

    if (pageResponseData != null) {
      yield put({
        type: LIST_ACTION_TYPE.PAGE_RETRIEVED_FROM_SERVER,
        elementType: action.elementType,
        userRoleString: action.userRoleString,
        serverResponse: pageResponseData,
        pageNumber: action.pageNumber,
        sortingCriteria: action.sortingCriteria
      });
    }
  }
  else {
    yield put({
      type: LIST_ACTION_TYPE.NO_RETRIEVAL_NEEDED,
      elementType: action.elementType,
      userRoleString: action.userRoleString
    });
  }
}

/**
 * Checks if there have been any server-side updates to the list by
 * sending the timestamp of the latest retrieved element.
 * It updates the state accordingly if the server confirms the presence of updates
 * @param {*} latestUpdateTimestamp timestamp of the latest retrieved element
 * @param {*} action Action of type START_AUTO_CHECKING or PAGE_REQUEST
 */
function* checkForListUpdates(latestUpdateTimestamp, action) {
  const updateResponseData = yield makeRequestAndReportErrors(
    getListRequestPath(action.elementType, 'update'),
    {
      type: LIST_ACTION_TYPE.UPDATE_CHECKING_ERROR,
      elementType: action.elementType,
      userRoleString: action.userRoleString
    },
    { latest_update_timestamp: latestUpdateTimestamp },
    yield select(state => state.auth.accessToken)
  );

  if (updateResponseData != null) {
    yield put({
      type: LIST_ACTION_TYPE.UPDATE_RECEIVED,
      userRoleString: action.userRoleString,
      elementType: action.elementType,
      latestUpdateTimestamp: updateResponseData.latest_update_timestamp,
      updatesFound: updateResponseData.updates_found
    });

    if (!updateResponseData.updates_found)
      console.log(`No ${action.elementType} list updates found`);
  }
}

// Contains the auto update checking tasks corresponding to the lists of the specified element type,
// so that they can be started and stopped from different functions (see below).
// This assumes that there can't be more than a list for the same element type in the same view
const autoUpdateTasks = {
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
        yield checkForListUpdates(
          yield select(state => state[action.userRoleString][action.elementType].latestUpdateTimestamp),
          action
        );
      }
    }
  }
  finally {
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

export const listSagas = [
  updateCheckingTasksRunner(),
  updateCheckingTasksStopper(),
  takeLatest(LIST_ACTION_TYPE.PAGE_REQUEST, retrieveListPage),
  //debounce(SEARCH_DEBOUNCE_DELAY_MS, LIST_ACTION_TYPE.ON_SEARCH_QUERY_CHANGED, retrieveListPage)
];
