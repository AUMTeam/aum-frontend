import { TECHNICAL_AREA_MANAGER_ACTION_TYPE } from '../../actions/views/technicalAreaManager';
import { LIST_ELEMENTS_TYPE } from '../../../constants/api';

const initialState = {
  reviewInProgress: [],
  successfullyReviewed: {},
  reviewFailed: {}
};

const viewState = {
  [LIST_ELEMENTS_TYPE.COMMITS]: { ...initialState },
  [LIST_ELEMENTS_TYPE.SEND_REQUESTS]: { ...initialState }
};

// prettier-ignore
export function technicalAreaManager(state = viewState, action) {
  if (action.elementType != null)
    return { ...state, [action.elementType]: elementsReducer(state[action.elementType], action) };
  else if (action.type === TECHNICAL_AREA_MANAGER_ACTION_TYPE.RESET_UI)
    return viewState;
  else
    return state;
}

function elementsReducer(state = initialState, action) {
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
