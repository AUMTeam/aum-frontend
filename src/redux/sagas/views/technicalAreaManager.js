import { put, takeEvery } from 'redux-saga/effects';
import { getRequestPath } from '../../../utils/apiUtils';
import { TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../actions/views/technicalAreaManager';
import { AuthenticatedApiRequest } from '../api';

/**
 * Performs approval of rejection of the commit/send request passed through the action
 * @param {*} action action of type ELEMENT_REVIEW_REQUEST
 */
function* reviewListElement(action) {
  const request = new AuthenticatedApiRequest(getRequestPath(action.elementType, 'approve'))
    .setRequestData({
      id: action.elementId,
      approve_flag: action.approvalStatus
    })
    .setErrorAction({
      ...action,
      type: TECHNICAL_AREA_MANAGER_ACTION_TYPE.REVIEW_ITEM_FAILED
    });

  const reviewResponseData = yield request.makeAndReportErrors();
  if (reviewResponseData != null) {
    console.log(`Element ${action.elementId} reviewed successfully`);
    yield put({
      ...action,
      type: TECHNICAL_AREA_MANAGER_ACTION_TYPE.REVIEW_ITEM_SUCCESSFUL
    });
  }
}

export const technicalAreaManagerSagas = [
  takeEvery(TECHNICAL_AREA_MANAGER_ACTION_TYPE.REVIEW_ITEM_REQUEST, reviewListElement)
];
