import { put, select, takeEvery } from 'redux-saga/effects';
import { getRequestPath } from '../../../utils/apiUtils';
import { PROGRAMMER_ACTION_TYPE } from '../../actions/views/programmer';
import { makeRequestAndReportErrors } from '../api';

/**
 * Adds a new element that could be a send request or a commit. Dispatches the successful action to notify
 * the dialog that the addition has been successfully performed, otherwise it will dispatch a failed
 * action to notify the dialog of the problem that just occurred.
 * @param {*} action action of element type PROGRAMMER_ACTION_TYPE.ADD_ELEMENT
 */
function* addElement(action) {
    const addElementResponseData = yield makeRequestAndReportErrors(
        getRequestPath(action.elementType, 'add'),
        { type: PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_FAILED },
        { ...action.payload },
        yield select(state => state.auth.accessToken)
    )

    if (addElementResponseData != null) {
        console.log('New send request successfully added')
        yield put({
            type: PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_SUCCESSFUL
        })
    } 
}

export const programmerSagas = [
    takeEvery(PROGRAMMER_ACTION_TYPE.ADD_NEW_SEND_REQUEST, addElement)  
]