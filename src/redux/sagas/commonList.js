import {
  actionChannel,
  cancel,
  cancelled,
  debounce,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';
import { LIST_AUTO_UPDATE_INTERVAL_MS, LIST_ELEMENTS_PER_PAGE, SEARCH_DEBOUNCE_DELAY_MS } from '../../constants/api';
import { getListRequestPath } from '../../utils/apiUtils';
import { LIST_ACTION_TYPE } from '../actions/commonList';
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
    yield select(state => state.lists[action.userRoleString][action.elementType].latestUpdateTimestamp),
    action
  );

  const listPages = yield select(state => state.lists[action.userRoleString][action.elementType].listPages);
  const requestedPageAlreadyFetched = action.pageNumber in listPages;
  if (requestedPageAlreadyFetched) {
    const latestUpdateTimestamp = yield select(
      state => state.lists[action.userRoleString][action.elementType].latestUpdateTimestamp
    );
    var requestedPageNotUpdated = listPages[action.pageNumber].updateTimestamp < latestUpdateTimestamp;
    var sortingCriteriaDifferent =
      action.sortingCriteria.columnKey !== listPages[action.pageNumber].sorting.columnKey ||
      action.sortingCriteria.direction !== listPages[action.pageNumber].sorting.direction;
    var filteringDifferent =
      action.filter.attribute !== listPages[action.pageNumber].filter.attribute ||
      action.filter.valueMatches !== listPages[action.pageNumber].filter.valueMatches ||
      action.filter.valueDifferentFrom !== listPages[action.pageNumber].filter.valueDifferentFrom;
  }

  // Fetch page only if needed
  if (!requestedPageAlreadyFetched || requestedPageNotUpdated || sortingCriteriaDifferent || filteringDifferent) {
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
        sort:
          action.sortingCriteria.columnKey == null
            ? {}
            : {
                parameter: action.sortingCriteria.columnKey,
                order: action.sortingCriteria.direction
              },
        filter: action.filter
      },
      yield select(state => state.auth.accessToken)
    );

    if (pageResponseData != null) {
      yield put({
        type: LIST_ACTION_TYPE.PAGE_RETRIEVED_FROM_SERVER,
        elementType: action.elementType,
        userRoleString: action.userRoleString,
        serverResponse: pageResponseData,
        // if we asked for a non-existing page, the server gives us the last page
        pageNumber: pageResponseData.page,
        sortingCriteria: action.sortingCriteria,
        filter: action.filter
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
    if (updateResponseData.updates_found)
      yield put({
        type: LIST_ACTION_TYPE.UPDATE_RECEIVED,
        userRoleString: action.userRoleString,
        elementType: action.elementType,
        latestUpdateTimestamp: updateResponseData.latest_update_timestamp
      });
    // prettier-ignore
    else
      console.log(`No ${action.elementType} list updates found`);
  }
}

// Contains the auto update checking tasks corresponding to the lists of the specified element type and view,
// so that they can be started and stopped from different functions (see below).
// Keys are in the form `${userRoleString}.${elementType}`.
// This assumes that there can't be more than a update checking task for the same list in the same view
const autoUpdateTasks = {};

/**
 * Dispatches and stops update checking tasks according to the actions dispatched.
 * Uses a channel to watch for actions START_AUTO_CHECKING and STOP_AUTO_CHECKING: in this way
 * incoming actions can be enqueued in a buffer while the saga handles the current one (nullifies
 * the chance of losing an action, which is very unlikely without a buffer anyway).
 */
function* updateCheckingTasksManager() {
  const actionsChannel = yield actionChannel([
    LIST_ACTION_TYPE.START_AUTO_CHECKING,
    LIST_ACTION_TYPE.STOP_AUTO_CHECKING
  ]);

  // prettier-ignore
  while (true) {
    const action = yield take(actionsChannel);
    const taskKey = `${action.userRoleString}.${action.elementType}`;

    if (action.type === LIST_ACTION_TYPE.START_AUTO_CHECKING) {
      if (autoUpdateTasks[taskKey] == null)
        autoUpdateTasks[taskKey] = yield fork(() => runListUpdateChecker(action));
      else
        console.error(`There is another update checking task running for ${taskKey}`);
    }
    else if (action.type === LIST_ACTION_TYPE.STOP_AUTO_CHECKING) {
      if (autoUpdateTasks[taskKey] != null) {
        yield cancel(autoUpdateTasks[taskKey]);
        autoUpdateTasks[taskKey] = null;
      }
      else
        console.error('Tried to stop an unexisting update checking task.');
    }
  }
}

/**
 * Performs automatic update checking for the list
 * every LIST_AUTO_UPDATE_INTERVAL_MS milliseconds
 * @param {*} action Action of type START_AUTO_CHECKING
 */
function* runListUpdateChecker(action) {
  try {
    console.log(`Auto update checking started for ${action.userRoleString}.${action.elementType}`);
    while (true) {
      yield delay(LIST_AUTO_UPDATE_INTERVAL_MS);
      // Avoid checking for updates when the state of the list is not yet initialized
      // or when retrieveListPage() is running
      if (
        (yield select(state => state.lists[action.userRoleString][action.elementType] != null)) &&
        (yield select(state => !state.lists[action.userRoleString][action.elementType].isLoadingList))
      ) {
        console.log(`Checking for ${action.userRoleString}.${action.elementType} updates...`);
        yield checkForListUpdates(
          yield select(state => state.lists[action.userRoleString][action.elementType].latestUpdateTimestamp),
          action
        );
      }
    }
  } finally {
    if (yield cancelled())
      console.log(`Auto update checking stopped for ${action.userRoleString}.${action.elementType}`);
    // prettier-ignore
    else
      console.error(`Unexpected error during ${action.userRoleString}.${action.elementType} auto updating task`);
  }
}

export const listSagas = [
  updateCheckingTasksManager(),
  takeLatest(LIST_ACTION_TYPE.PAGE_REQUEST, retrieveListPage),
  debounce(SEARCH_DEBOUNCE_DELAY_MS, LIST_ACTION_TYPE.SEARCH_QUERY_CHANGED, retrieveListPage),
];
