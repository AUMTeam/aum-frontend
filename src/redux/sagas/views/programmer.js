import { put, takeEvery } from 'redux-saga/effects';
import { ELEMENT_ENDPOINT_TYPE } from '../../../constants/api';
import { getRequestPath } from '../../../utils/apiUtils';
import { PROGRAMMER_ACTION_TYPE } from '../../actions/views/programmer';
import { AuthenticatedApiRequest } from '../api';
import { checkForListUpdates } from '../commonList';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../../constants/user';

/**
 * Adds a new element that could be a send request or a commit. Dispatches the successful action to notify
 * the dialog that the addition has been successfully performed, otherwise it will dispatch a failed
 * action to notify the dialog of the problem that just occurred.
 * @param {*} action
 */
function* addElement(action) {
  const request = new AuthenticatedApiRequest(getRequestPath(action.elementType, ELEMENT_ENDPOINT_TYPE.ADD))
    .setRequestData({ ...action.payload })
    .setErrorAction({ type: PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_FAILED });

  const addElementResponseData = yield request.makeAndReportErrors();
  if (addElementResponseData != null) {
    yield put({ type: PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_SUCCESSFUL });

    yield checkForListUpdates({
      elementType: action.elementType,
      userRoleString: USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]
    });
  }
}

function* removeElement(action) {
  const request = new AuthenticatedApiRequest(getRequestPath(action.elementType, ELEMENT_ENDPOINT_TYPE.REMOVE))
    .setRequestData({ id: action.elementId })
    .setErrorAction({ type: PROGRAMMER_ACTION_TYPE.REMOVE_ELEMENT_FAILED });

  const addElementResponseData = yield request.makeAndReportErrors();
  if (addElementResponseData != null) {
    yield put({
      type: PROGRAMMER_ACTION_TYPE.REMOVE_ELEMENT_SUCCESSFUL,
      elementId: action.elementId
    });

    yield checkForListUpdates({
      elementType: action.elementType,
      userRoleString: USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]
    });
  }
}

/**
 * Gets the short list of the elements of a specific type (clients, branches, commits) that belong to a specific user.
 * If the request is successful we will dispatch an action to notify and send the data received to the subscribed components.
 * In this case we are going to use this data to populate the react-select textfields.
 * @param {*} action
 */
function* getShortListForElement(action) {
  const request = new AuthenticatedApiRequest(
    getRequestPath(action.elementType, ELEMENT_ENDPOINT_TYPE.SHORT_LIST)
  ).setErrorAction({ type: PROGRAMMER_ACTION_TYPE.GET_SHORT_LIST_FAILED });

  const shortListResponseData = yield request.makeAndReportErrors();
  if (shortListResponseData != null) {
    console.log(action.elementType + ' short list successfully loaded');
    yield put({
      type: PROGRAMMER_ACTION_TYPE.GET_SHORT_LIST_SUCCESSFUL,
      elementType: action.elementType,
      payload: shortListResponseData
    });
  }
}

export const programmerSagas = [
  takeEvery(PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_REQUEST, addElement),
  takeEvery(PROGRAMMER_ACTION_TYPE.REMOVE_ELEMENT_REQUEST, removeElement),
  takeEvery(PROGRAMMER_ACTION_TYPE.GET_SHORT_LIST_REQUEST, getShortListForElement)
];
