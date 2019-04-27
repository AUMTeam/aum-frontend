import { put, select, takeEvery } from 'redux-saga/effects';
import { getRequestPath } from '../../../utils/apiUtils';
import { makeRequestAndReportErrors } from '../api';
import { TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../actions/views/technicalAreaManager';

/**
 * Performs approval of rejection of the commit/send request passed through the action
 * @param {*} action action of type ELEMENT_REVIEW_REQUEST
 */
function* reviewListElement(action) {
  const reviewResponseData = yield makeRequestAndReportErrors(
    getRequestPath(action.elementType, 'approve'),
    { ...action, type: TECHNICAL_AREA_MANAGER_ACTION_TYPE.REVIEW_ITEM_FAILED },
    {
      id: action.elementId,
      approve_flag: action.approvalStatus
    },
    yield select(state => state.auth.accessToken)
  );

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
