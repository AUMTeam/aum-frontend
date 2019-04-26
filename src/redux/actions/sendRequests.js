import { LIST_ELEMENTS_PER_PAGE, ELEMENT_TYPE } from '../../constants/api';
import { LIST_ACTION_TYPE } from './commonList';

export function retrieveSendRequestsListPageAction(
  userRoleString,
  pageNumber = 0,
  sortingCriteria = { columnKey: null, direction: 'desc' },
  filter = {}
) {
  return {
    type: LIST_ACTION_TYPE.PAGE_REQUEST,
    elementType: ELEMENT_TYPE.SEND_REQUESTS,
    userRoleString,
    pageNumber,
    limit: LIST_ELEMENTS_PER_PAGE,
    sortingCriteria,
    filter
  };
}

export function startSendRequestsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: LIST_ACTION_TYPE.START_AUTO_CHECKING,
    elementType: ELEMENT_TYPE.SEND_REQUESTS,
    userRoleString
  };
}

export function stopSendRequestsListUpdatesAutoCheckingAction(userRoleString) {
  return {
    type: LIST_ACTION_TYPE.STOP_AUTO_CHECKING,
    elementType: ELEMENT_TYPE.SEND_REQUESTS,
    userRoleString
  };
}
