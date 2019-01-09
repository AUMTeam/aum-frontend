import { getSearchFilter } from '../../utils/apiUtils';

export const LIST_ACTION_TYPE = {
  // Dispatched when a page of the list needs to be loaded
  PAGE_REQUEST: 'PAGE_REQUEST',

  // Dispatched when an error occurred during a remote request to retrieve elements
  PAGE_RETRIEVAL_ERROR: 'PAGE_LOADING_ERROR',

  // Dispatched when a list page is succesfully retrieved from the server
  PAGE_RETRIEVED_FROM_SERVER: 'PAGE_LOADED',

  // Dispatched when a list page is already present locally and up-to-date
  // and therefore doesn't need to be retrieved from server
  NO_RETRIEVAL_NEEDED: 'NO_RETRIEVAL_NEEDED',

  // Dispatched when the server responds to an update check reporting new changes
  UPDATE_RECEIVED: 'UPDATE_RECEIVED',

  // Dispatched when a list update check fails
  UPDATE_CHECKING_ERROR: 'UPDATE_CHECKING_ERROR',

  // Dispatched when the view containing the list is loaded, so that the auto updater task can start
  START_AUTO_CHECKING: 'START_AUTO_CHECKING',

  // Dispatched when the view containing the list is unmounted: stops the auto updater task
  STOP_AUTO_CHECKING: 'STOP_AUTO_CHECKING',

  // Dispatched when the search query is changed
  SEARCH_QUERY_CHANGED: 'SEARCH_QUERY_CHANGED',

  // These two actions are ignored by reducers, since they're used only to trigger saga functions
  // which perform item approval/rejection API requests
  ELEMENT_REVIEW_REQUEST: 'ELEMENT_REVIEW_REQUEST',
  ELEMENT_REVIEW_FAILED: 'ELEMENT_REVIEW_FAILED',

  // TBD
  SHOW_ELEMENT_DETAILS: 'SHOW_ELEMENT_DETAILS',

  // TBD
  ADD_ELEMENT: 'ADD_ELEMENT'
};

/**
 * This action is dispatched only when the user edits search text field and
 * therefore a new search is requested. That's why pageNumber is always 0.
 * Takes a PAGE_REQUEST action as a parameter since most of its data are used
 * (allows for better code reuse).
 */
export function performNewSearchAction(pageRequestAction, searchQuery) {
  return {
    type: LIST_ACTION_TYPE.SEARCH_QUERY_CHANGED,
    elementType: pageRequestAction.elementType,
    userRoleString: pageRequestAction.userRoleString,
    pageNumber: 0,
    limit: pageRequestAction.limit,
    sortingCriteria: pageRequestAction.sortingCriteria,
    filter: getSearchFilter(searchQuery)
  };
}

export function reviewItemAction(elementType, elementId, approvalStatus, callback) {
  return {
    type: LIST_ACTION_TYPE.ELEMENT_REVIEW_REQUEST,
    elementType,
    elementId,
    approvalStatus,
    callback
  };
}
