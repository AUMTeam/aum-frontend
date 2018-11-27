import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';

export const COMMITS_ACTION_TYPE_KEYS = {
  // Dispatched when a page of the commits list needs to be loaded
  COMMITS_LIST_PAGE_REQUEST: 'COMMITS_LIST_PAGE_REQUEST',

  // Dispatched when an error occurred during a remote request to retrieve commits
  COMMITS_LIST_PAGE_RETRIEVAL_ERROR: 'COMMITS_LIST_PAGE_LOADING_ERROR',

  // Dispatched when a list page is succesfully retrieved from the server
  COMMITS_LIST_PAGE_RETRIEVED_FROM_SERVER: 'COMMITS_LIST_PAGE_LOADED',

  // Dispatched when a list page is already present locally and up-to-date
  // and therefore doesn't need to be retrieved from server
  COMMITS_LIST_NO_RETRIEVAL_NEEDED: 'COMMITS_LIST_NO_RETRIEVAL_NEEDED',

  // Dispatched when the server responds successfully to an update check (regardless of there are updates or not)
  COMMITS_LIST_UPDATE_RECEIVED: 'COMMITS_LIST_UPDATE_RECEIVED',

  // Dispatched when a list update check fails
  COMMITS_LIST_UPDATE_CHECKING_ERROR: 'COMMITS_LIST_UPDATE_CHECKING_ERROR',

  // Dispatched when the view containing the list is loaded, so that the auto updater task can start
  COMMITS_LIST_START_AUTO_CHECKING: 'COMMITS_LIST_START_AUTO_CHECKING',

  // Dispatched when the view containing the list is unmounted: stops the auto updater task
  COMMITS_LIST_STOP_AUTO_CHECKING: 'COMMITS_LIST_STOP_AUTO_CHECKING',
  SHOW_COMMIT_DETAILS: 'SHOW_COMMIT_DETAILS',
};

export function retrieveCommitsListPageAction(pageNumber, userRoleString) {
  return {
    type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_REQUEST,
    pageNumber,
    limit: LIST_ELEMENTS_PER_PAGE,
    userRoleString
  };
}

export function startCommitsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_START_AUTO_CHECKING,
    userRoleString
  };
}

export function stopCommitsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_STOP_AUTO_CHECKING,
    userRoleString
  };
}
