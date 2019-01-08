import { delay } from 'redux-saga';
import { cancel, cancelled, fork, put, select, take, takeLatest, takeEvery, /* debounce */ } from 'redux-saga/effects';
import { LIST_AUTO_UPDATE_INTERVAL, LIST_ELEMENTS_PER_PAGE, SEARCH_DEBOUNCE_DELAY_MS } from '../../constants/api';
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
        sort: action.sortingCriteria.columnKey == null ? {} : {
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

/**
 * Performs approval of rejection of the commit/send request passed through the action.
 * The outcome of this operation isn't notified with the dispatch of an action, rather with
 * the execution of a callback whose signature is (elementId, success: bool)
 * @param {*} action action of type ELEMENT_REVIEW_REQUEST
 */
function* reviewListElement(action) {
  const reviewResponseData = yield makeRequestAndReportErrors(
    getListRequestPath(action.elementType, 'approve'),
    { ...action, type: LIST_ACTION_TYPE.ELEMENT_REVIEW_FAILED },
    {
      id: action.elementId,
      approve_flag: action.approvalStatus
    },
    yield select(state => state.auth.accessToken)
  );

  if (reviewResponseData != null) {
    console.log(`Element ${action.elementId} reviewed successfully`);
    action.callback(action.elementId, action.approvalStatus, true);
  }
  // Error callback is called by the saga triggered by ELEMENT_REVIEW_FAILED action (see below)
}


// Contains the auto update checking tasks corresponding to the lists of the specified element type and view,
// so that they can be started and stopped from different functions (see below).
// Keys are in the form `${userRoleString}.${elementType}`.
// This assumes that there can't be more than a update checking task for the same list in the same view
const autoUpdateTasks = {};

/**
 * Performs automatic update checking for the list
 * every LIST_AUTO_UPDATE_INTERVAL milliseconds
 * @param {*} action Action of type START_AUTO_CHECKING
 */
function* runListUpdateChecker(action) {
  try {
    console.log(`Auto update checking started for ${action.userRoleString}.${action.elementType}`);
    while (true) {
      yield delay(LIST_AUTO_UPDATE_INTERVAL);
      // Avoid checking for updates when the state of the list is not yet initialized
      // or when retrieveListPage() is running
      if ((yield select(state => state[action.userRoleString][action.elementType] != null)) &&
          (yield select(state => !state[action.userRoleString][action.elementType].isLoadingList))) {
        console.log(`Checking for ${action.userRoleString}.${action.elementType} updates...`);
        yield checkForListUpdates(
          yield select(state => state[action.userRoleString][action.elementType].latestUpdateTimestamp),
          action
        );
      }
    }
  }
  finally {
    if (yield cancelled())
      console.log(`Auto update checking stopped for ${action.userRoleString}.${action.elementType}`);
    else
      console.error(`Unexpected error during ${action.userRoleString}.${action.elementType} auto updating task`);
  }
}

function* updateCheckingTasksRunner() {
  while (true) {
    const action = yield take(LIST_ACTION_TYPE.START_AUTO_CHECKING);
    if (autoUpdateTasks[`${action.userRoleString}.${action.elementType}`] == null)
      autoUpdateTasks[`${action.userRoleString}.${action.elementType}`] = yield fork(() =>
        runListUpdateChecker(action)
      );
    else
      console.error(`There is another update checking task running for ${action.userRoleString}.${action.elementType}`);
  }
}

function* updateCheckingTasksStopper() {
  while (true) {
    const action = yield take(LIST_ACTION_TYPE.STOP_AUTO_CHECKING);
    if (autoUpdateTasks[`${action.userRoleString}.${action.elementType}`] != null) {
      yield cancel(autoUpdateTasks[`${action.userRoleString}.${action.elementType}`]);
      autoUpdateTasks[`${action.userRoleString}.${action.elementType}`] = null;
    }
    else
      console.error('Tried to stop an unexisting update checking task.');
  }
}

export const listSagas = [
  updateCheckingTasksRunner(),
  updateCheckingTasksStopper(),
  takeLatest(LIST_ACTION_TYPE.PAGE_REQUEST, retrieveListPage),
  takeLatest(LIST_ACTION_TYPE.SEARCH_QUERY_CHANGED, retrieveListPage), // TODO debounce with saga v1
  takeEvery(LIST_ACTION_TYPE.ELEMENT_REVIEW_REQUEST, reviewListElement),
  // reports errors in review requests
  takeEvery(LIST_ACTION_TYPE.ELEMENT_REVIEW_FAILED, action =>
    action.callback(action.elementId, action.approvalStatus, false)
  )
];
