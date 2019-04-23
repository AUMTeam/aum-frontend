import { TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../actions/views/technicalAreaManager';
import { LIST_ELEMENTS_TYPE } from '../../../constants/api';

const initialSubState = {
  reviewInProgress: [], // contains the IDs of the items whose review is in progress
  /* The following objects are used as a map: the key is the element ID,
    whereas the value is the approval flag chosen by user (approved (1) or rejected(-1)) */
  successfullyReviewed: {},
  reviewFailed: {}
};

const initialViewState = {
  [LIST_ELEMENTS_TYPE.COMMITS]: { ...initialSubState },
  [LIST_ELEMENTS_TYPE.SEND_REQUESTS]: { ...initialSubState }
};

// prettier-ignore
export function technicalAreaManagerViewReducer(state = initialViewState, action) {
  if (action.elementType != null)
    return { ...state, [action.elementType]: elementsReducer(state[action.elementType], action) };
  else if (action.type === TECHNICAL_AREA_MANAGER_ACTION_TYPE.RESET_UI)
    return initialViewState;
  else
    return state;
}

function elementsReducer(state = initialSubState, action) {
  switch (action.type) {
    case TECHNICAL_AREA_MANAGER_ACTION_TYPE.REVIEW_ITEM_REQUEST:
      const newState = {
        ...state,
        reviewInProgress: [...state.reviewInProgress, action.elementId],
        reviewFailed: { ...state.reviewFailed }
      };
      // prettier-ignore
      if (newState.reviewFailed[action.elementId] != null)
        delete newState.reviewFailed[action.elementId];
      return newState;
    case TECHNICAL_AREA_MANAGER_ACTION_TYPE.REVIEW_ITEM_SUCCESSFUL:
      return {
        ...state,
        reviewInProgress: state.reviewInProgress.filter(element => element !== action.elementId),
        successfullyReviewed: { ...state.successfullyReviewed, [action.elementId]: action.approvalStatus }
      };
    case TECHNICAL_AREA_MANAGER_ACTION_TYPE.REVIEW_ITEM_FAILED:
      return {
        ...state,
        reviewInProgress: state.reviewInProgress.filter(element => element !== action.elementId),
        reviewFailed: { ...state.reviewFailed, [action.elementId]: action.approvalStatus }
      };
    default:
      return state;
  }
}
