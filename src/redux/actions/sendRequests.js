import { LIST_ELEMENTS_PER_PAGE, LIST_ELEMENTS_TYPE } from '../../constants/api';
import { LIST_ACTION_TYPE } from './lists';

export function retrieveSendRequestsListPageAction(
  pageNumber,
  userRoleString,
  sortingCriteria = { columnKey: null, direction: 'asc' }
) {
  return {
    type: LIST_ACTION_TYPE.PAGE_REQUEST,
    elementType: LIST_ELEMENTS_TYPE.SEND_REQUESTS,
    userRoleString,
    pageNumber,
    limit: LIST_ELEMENTS_PER_PAGE,
    sortingCriteria
  };
}

export function startSendRequestsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: LIST_ACTION_TYPE.START_AUTO_CHECKING,
    elementType: LIST_ELEMENTS_TYPE.SEND_REQUESTS,
    userRoleString
  };
}

export function stopSendRequestsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: LIST_ACTION_TYPE.STOP_AUTO_CHECKING,
    elementType: LIST_ELEMENTS_TYPE.SEND_REQUESTS,
    userRoleString
  };
}
