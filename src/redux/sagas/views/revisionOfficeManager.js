import { put, select, takeEvery } from 'redux-saga/effects';
import { getRequestPath } from '../../../utils/apiUtils';
import { makeAuthenticatedRequestAndReportErrors } from '../api';
import { REVISION_OFFICE_MANAGER_ACTION_TYPE } from '../../actions/views/revisionOfficeManager';
import { ELEMENT_TYPE } from '../../../constants/api';

/**
 * Performs an API request to deliver the specified send request to its recipient clients
 * @param {*} action action of type REV_OFFICE_ELEMENT_DELIVERY_REQUEST
 */
function* deliverSendRequest(action) {
  const responseData = yield makeAuthenticatedRequestAndReportErrors(
    getRequestPath(ELEMENT_TYPE.SEND_REQUESTS, 'send'),
    {
      type: REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_FAILED,
      elementId: action.elementId
    },
    {
      id: action.elementId,
      install_link: action.installLink
    }
  );

  if (responseData != null) {
    yield put({
      type: REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_SUCCESSFUL,
      elementId: action.elementId
    });
  }
}

export const revisionOfficeManagerSagas = [
  takeEvery(REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_REQUEST, deliverSendRequest)
];
