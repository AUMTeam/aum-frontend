import { actionChannel, cancel, cancelled, delay, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import {
  LIST_AUTO_UPDATE_INTERVAL_MS,
  LIST_ELEMENTS_PER_PAGE,
  SEARCH_DEBOUNCE_DELAY_MS,
  ELEMENT_ENDPOINT_TYPE
} from '../../constants/api';
import { getRequestPath } from '../../utils/apiUtils';
import { LIST_ACTION_TYPE } from '../actions/commonList';
import { AuthenticatedApiRequest } from './api';
import { strictDebounce } from './utils';

/**
 * Retrieves the list of elements for the requested page if needed
 * Before fetching, it checks for updates in order to ensure that the most recent version
 * of the page is fetched if we have an older version cached
 * @param {*} action Action of type PAGE_REQUEST
 */
function* retrieveListPage(action) {
  yield checkForListUpdates(action);

  const listState = yield select(state => state.lists[action.userRoleString][action.elementType]);
  if (pageNeedsToBeFetched(listState, action)) {
    const pageRequest = new AuthenticatedApiRequest(getRequestPath(action.elementType, ELEMENT_ENDPOINT_TYPE.LIST))
      .setRequestData({
        page: action.pageNumber,
        limit: LIST_ELEMENTS_PER_PAGE,
        sort:
          action.sortingCriteria.columnKey == null
            ? {}
            : {
                parameter: action.sortingCriteria.columnKey,
                order: action.sortingCriteria.direction
              },
        filter: [action.filter],

        // this is used by server only for sendRequests list, in order to give us
        // only the requests which must be shown in that particular view
        role: action.userRoleString
      })
      .setErrorAction({
        type: LIST_ACTION_TYPE.PAGE_RETRIEVAL_ERROR,
        elementType: action.elementType,
        userRoleString: action.userRoleString
      });

    const pageResponseData = yield pageRequest.makeWithTimeoutAndReportErrors();
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

function pageNeedsToBeFetched(listState, action) {
  const requestedPageAlreadyFetched = action.pageNumber in listState.listPages;
  // prettier-ignore
  if (!requestedPageAlreadyFetched)
    return true;

  const latestUpdateTimestamp = listState.latestUpdateTimestamp;
  const currentPageState = listState.listPages[action.pageNumber];

  const requestedPageNotUpdated = currentPageState.updateTimestamp < latestUpdateTimestamp;
  const pageSortingCriteriaIsDifferent =
    action.sortingCriteria.columnKey !== currentPageState.sorting.columnKey ||
    action.sortingCriteria.direction !== currentPageState.sorting.direction;
  const pageFilteringIsDifferent =
    action.filter.attribute !== currentPageState.filter.attribute ||
    action.filter.valueMatches !== currentPageState.filter.valueMatches ||
    action.filter.valueDifferentFrom !== currentPageState.filter.valueDifferentFrom;

  return requestedPageNotUpdated || pageSortingCriteriaIsDifferent || pageFilteringIsDifferent;
}

/**
 * Checks if there have been any server-side updates to the list by
 * sending the timestamp of the latest retrieved element.
 * It updates the state accordingly if the server confirms the presence of updates
 * @param {*} latestUpdateTimestamp timestamp of the latest retrieved element
 * @param {*} action Action of type START_AUTO_CHECKING or PAGE_REQUEST
 */
export function* checkForListUpdates(action) {
  console.log(`Checking for ${action.userRoleString}.${action.elementType} updates...`);

  const latestUpdateTimestamp = yield select(
    state => state.lists[action.userRoleString][action.elementType].latestUpdateTimestamp
  );

  const updateRequest = new AuthenticatedApiRequest(getRequestPath(action.elementType, ELEMENT_ENDPOINT_TYPE.UPDATE))
    .setRequestData({
      latest_update_timestamp: latestUpdateTimestamp,
      section: action.userRoleString
    })
    .setErrorAction({
      type: LIST_ACTION_TYPE.UPDATE_CHECKING_ERROR,
      elementType: action.elementType,
      userRoleString: action.userRoleString
    });

  const updateResponseData = yield updateRequest.makeWithTimeoutAndReportErrors();
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

/**
 * Dispatches and stops update checking tasks according to the actions dispatched.
 * Uses a channel to watch for actions START_AUTO_CHECKING and STOP_AUTO_CHECKING: in this way
 * incoming actions can be enqueued in a buffer while the saga handles the current one (nullifies
 * the chance of losing an action, which is very unlikely without a buffer anyway).
 */
function* manageUpdateCheckingTasks() {
  const actionsChannel = yield actionChannel([
    LIST_ACTION_TYPE.START_AUTO_CHECKING,
    LIST_ACTION_TYPE.STOP_AUTO_CHECKING
  ]);

  // Contains the update checking tasks. They are uniquely identified by the name of the view
  // (which equals to the user role) and the type of the elements (commits or send requests).
  // This assumes that there can't be more than an update checking task for the same list in the same view
  const updateCheckingTasks = {};

  // prettier-ignore
  while (true) {
    const action = yield take(actionsChannel);
    const taskKey = `${action.userRoleString}.${action.elementType}`;

    if (action.type === LIST_ACTION_TYPE.START_AUTO_CHECKING) {
      if (updateCheckingTasks[taskKey] == null)
        updateCheckingTasks[taskKey] = yield fork(() => runListUpdateChecker(action));
      else
        console.error(`There is another update checking task running for ${taskKey}`);
    }
    else if (action.type === LIST_ACTION_TYPE.STOP_AUTO_CHECKING) {
      if (updateCheckingTasks[taskKey] != null) {
        yield cancel(updateCheckingTasks[taskKey]);
        updateCheckingTasks[taskKey] = null;
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
    // prettier-ignore
    while (true) {
      yield delay(LIST_AUTO_UPDATE_INTERVAL_MS);
      const listState = yield select(state => state.lists[action.userRoleString][action.elementType]);
      if (isListStateInitialized(listState) && !isPageLoading(listState))
        yield checkForListUpdates(action);
    }
  } finally {
    if (yield cancelled())
      console.log(`Auto update checking stopped for ${action.userRoleString}.${action.elementType}`);
    // prettier-ignore
    else
      console.error(`Unexpected error during ${action.userRoleString}.${action.elementType} auto updating task`);
  }
}

function isListStateInitialized(listState) {
  return listState != null;
}

function isPageLoading(listState) {
  return listState.isLoadingList;
}

export const listSagas = [
  manageUpdateCheckingTasks(),
  takeLatest(LIST_ACTION_TYPE.PAGE_REQUEST, retrieveListPage),
  strictDebounce(SEARCH_DEBOUNCE_DELAY_MS, LIST_ACTION_TYPE.SEARCH_QUERY_CHANGED, retrieveListPage)
];
