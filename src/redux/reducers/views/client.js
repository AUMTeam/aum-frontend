import { CLIENT_ACTION_TYPE } from '../../actions/views/client';

const initialState = {
  successfullySentFeedbackForElements: [],
  isSendingFeeback: false,
  latestFeedbackFailed: false
};

export function clientViewReducer(state = initialState, action) {
  switch (action.type) {
    case CLIENT_ACTION_TYPE.SEND_FEEDBACK_REQUEST:
      return {
        ...state,
        isSendingFeeback: true,
        latestFeedbackFailed: false
      };
    case CLIENT_ACTION_TYPE.SEND_FEEDBACK_FAILED:
      return {
        ...state,
        isSendingFeeback: false,
        latestFeedbackFailed: true
      };
    case CLIENT_ACTION_TYPE.SEND_FEEDBACK_SUCCESSFUL:
      return {
        ...state,
        isSendingFeeback: false,
        latestFeedbackFailed: false,
        successfullySentFeedbackForElements: [...state.successfullySentFeedbackForElements, action.elementId]
      };
    case CLIENT_ACTION_TYPE.RESET_FAILED_FEEDBACK_FLAG:
      return {
        ...state,
        latestFeedbackFailed: initialState.latestFeedbackFailed
      };
    case CLIENT_ACTION_TYPE.RESET_UI:
      return initialState;
    default:
      return state;
  }
}
