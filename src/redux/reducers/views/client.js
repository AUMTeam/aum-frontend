import { CLIENT_ACTION_TYPE } from '../../actions/views/client';

const initialState = {
  successfullySentFeedbackForElements: [],
  isSendingFeedback: false,
  lastFeedbackFailed: false
};

export function clientViewReducer(state = initialState, action) {
  switch (action.type) {
    case CLIENT_ACTION_TYPE.SEND_FEEDBACK_REQUEST:
      return {
        ...state,
        isSendingFeedback: true,
        lastFeedbackFailed: false
      };
    case CLIENT_ACTION_TYPE.SEND_FEEDBACK_FAILED:
      return {
        ...state,
        isSendingFeedback: false,
        lastFeedbackFailed: true
      };
    case CLIENT_ACTION_TYPE.SEND_FEEDBACK_SUCCESSFUL:
      return {
        ...state,
        isSendingFeedback: false,
        lastFeedbackFailed: false,
        successfullySentFeedbackForElements: [...state.successfullySentFeedbackForElements, action.elementId]
      };
    case CLIENT_ACTION_TYPE.RESET_FAILED_FEEDBACK_FLAG:
      return {
        ...state,
        lastFeedbackFailed: initialState.lastFeedbackFailed
      };
    case CLIENT_ACTION_TYPE.RESET_UI:
      return initialState;
    default:
      return state;
  }
}
