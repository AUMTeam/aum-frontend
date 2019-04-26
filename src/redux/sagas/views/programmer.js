import { put, select, takeEvery } from 'redux-saga/effects';
import { LIST_ELEMENTS_TYPE } from '../../../constants/api';
import { getRequestPath } from '../../../utils/apiUtils';
import { PROGRAMMER_ACTION_TYPE } from '../../actions/views/programmer';
import { makeRequestAndReportErrors } from '../api';

/**
 * Adds a new element that could be a send request or a commit. Dispatches the successful action to notify
 * the dialog that the addition has been successfully performed, otherwise it will dispatch a failed
 * action to notify the dialog of the problem that just occurred.
 * @param {*} action
 */
function* addElement(action) {
  const addElementResponseData = yield makeRequestAndReportErrors(
    getRequestPath(action.elementType, 'add'),
    { type: PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_FAILED },
    { ...action.payload },
    yield select(state => state.auth.accessToken)
  );

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
  const getAllResponseData = yield makeRequestAndReportErrors(
    getRequestPath(LIST_ELEMENTS_TYPE.DATA, action.elementType),
    { type: PROGRAMMER_ACTION_TYPE.GET_ALL_FAILED },
    null,
    yield select(state => state.auth.accessToken)
  );

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
