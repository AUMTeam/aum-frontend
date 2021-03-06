import { LIST_ELEMENTS_PER_PAGE, ELEMENT_TYPE } from '../../constants/api';
import { LIST_ACTION_TYPE } from './commonList';

export function retrieveCommitsListPageAction(
  userRoleString,
  pageNumber = 0,
  sortingCriteria = { columnKey: null, direction: 'desc' },
  filter = {}
) {
  return {
    type: LIST_ACTION_TYPE.PAGE_REQUEST,
    elementType: ELEMENT_TYPE.COMMITS,
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
    elementType: ELEMENT_TYPE.COMMITS,
    userRoleString
  };
}

export function stopCommitsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: LIST_ACTION_TYPE.STOP_AUTO_CHECKING,
    elementType: ELEMENT_TYPE.COMMITS,
    userRoleString
  };
}
