import { put, takeEvery } from 'redux-saga/effects';
import { ELEMENT_TYPE } from '../../../constants/api';
import { getRequestPath } from '../../../utils/apiUtils';
import { PROGRAMMER_ACTION_TYPE } from '../../actions/views/programmer';
import { AuthenticatedApiRequest } from '../api';

/**
 * Adds a new element that could be a send request or a commit. Dispatches the successful action to notify
 * the dialog that the addition has been successfully performed, otherwise it will dispatch a failed
 * action to notify the dialog of the problem that just occurred.
 * @param {*} action
 */
function* addElement(action) {
  const request = new AuthenticatedApiRequest(getRequestPath(action.elementType, 'add'))
    .setRequestData({ ...action.payload })
    .setErrorAction({ type: PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_FAILED });

  const addElementResponseData = yield request.makeAndReportErrors();
  if (addElementResponseData != null) {
    console.log('New send request successfully added');
    yield put({
      type: PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_SUCCESSFUL
    });
  }
}

/**
 * Gets all the elements of a specific type (clients, branches, commits) that belongs to a specific user.
 * If the request is successful we will dispatch an action to notify and send the data received to the subscribed components.
 * In this case we are going to use this data to populate the react-select textfields.
 * @param {*} action
 */
function* getAll(action) {
  const request = new AuthenticatedApiRequest(getRequestPath(ELEMENT_TYPE.DATA, action.elementType))
    .setErrorAction({ type: PROGRAMMER_ACTION_TYPE.GET_ALL_FAILED });

  const getAllResponseData = yield request.makeAndReportErrors();
  if (getAllResponseData != null) {
    console.log('All list successfully loaded');
    yield put({
      type: PROGRAMMER_ACTION_TYPE.GET_ALL_SUCCESSFUL,
      elementType: action.elementType,
      payload: getAllResponseData
    });
  }
}

export const programmerSagas = [
  takeEvery(PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_REQUEST, addElement),
  takeEvery(PROGRAMMER_ACTION_TYPE.GET_ALL_REQUEST, getAll)
];
