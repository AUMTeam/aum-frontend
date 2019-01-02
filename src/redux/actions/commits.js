import { LIST_ELEMENTS_PER_PAGE, LIST_ELEMENTS_TYPE } from '../../constants/api';
import { LIST_ACTION_TYPE } from './lists';

export function retrieveCommitsListPageAction(
  userRoleString,
  pageNumber = 0,
  sortingCriteria = { columnKey: null, direction: 'desc' },
  filter = {}
) {
  return {
    type: LIST_ACTION_TYPE.PAGE_REQUEST,
    elementType: LIST_ELEMENTS_TYPE.COMMITS,
    userRoleString,
    pageNumber,
    limit: LIST_ELEMENTS_PER_PAGE,
    sortingCriteria,
    filter
  };
}

export function startCommitsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: LIST_ACTION_TYPE.START_AUTO_CHECKING,
    elementType: LIST_ELEMENTS_TYPE.COMMITS,
    userRoleString
  };
}

export function stopCommitsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: LIST_ACTION_TYPE.STOP_AUTO_CHECKING,
    elementType: LIST_ELEMENTS_TYPE.COMMITS,
    userRoleString
  };
}
