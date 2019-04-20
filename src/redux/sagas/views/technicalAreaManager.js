import { put, select, takeEvery } from 'redux-saga/effects';
import { getListRequestPath } from '../../../utils/apiUtils';
import { makeRequestAndReportErrors } from '../api';
import { TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../actions/views/technicalAreaManager';

/**
 * Performs approval of rejection of the commit/send request passed through the action.
 * The outcome of this operation isn't notified with the dispatch of an action, rather with
 * the execution of a callback whose signature is (elementId, success: bool)
 * @param {*} action action of type ELEMENT_REVIEW_REQUEST
 */
function* reviewListElement(action) {
  const reviewResponseData = yield makeRequestAndReportErrors(
    getListRequestPath(action.elementType, 'approve'),
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
