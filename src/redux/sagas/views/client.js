import { put, takeEvery } from 'redux-saga/effects';
import { getRequestPath } from '../../../utils/apiUtils';
import { AuthenticatedApiRequest } from '../api';
import { CLIENT_ACTION_TYPE } from '../../actions/views/client';
import { ELEMENT_TYPE } from '../../../constants/api';

function* sendInstallFeedback(action) {
  const request = new AuthenticatedApiRequest(getRequestPath(ELEMENT_TYPE.SEND_REQUESTS, 'install'))
    .setRequestData({
      id: action.elementId,
      install_status: action.installStatus,
      feedback: action.installFeedback
    })
    .setErrorAction({
      type: CLIENT_ACTION_TYPE.SEND_FEEDBACK_FAILED,
      elementId: action.elementId
    });

  const responseData = yield request.makeAndReportErrors();
  if (responseData != null) {
    yield put({
      type: CLIENT_ACTION_TYPE.SEND_FEEDBACK_SUCCESSFUL,
      elementId: action.elementId
    });
  }
}

export const clientSagas = [takeEvery(CLIENT_ACTION_TYPE.SEND_FEEDBACK_REQUEST, sendInstallFeedback)];
