import { REVISION_OFFICE_MANAGER_ACTION_TYPE } from '../../actions/views/revisionOfficeManager';

const initialState = {
  successfullyDeliveredElements: [],
  isDeliveringElement: false,
  latestDeliveryFailed: false
};

export function revisionOfficeManagerViewReducer(state = initialState, action) {
  switch (action.type) {
    case REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_REQUEST:
      return {
        ...state,
        isDeliveringElement: true,
        latestDeliveryFailed: false
      };
    case REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_FAILED:
      return {
        ...state,
        isDeliveringElement: false,
        latestDeliveryFailed: true
      };
    case REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_SUCCESSFUL:
      return {
        ...state,
        isDeliveringElement: false,
        latestDeliveryFailed: false,
        successfullyDeliveredElements: [...state.successfullyDeliveredElements, action.elementId]
      };
    case REVISION_OFFICE_MANAGER_ACTION_TYPE.RESET_FAILED_DELIVERY_FLAG:
      return {
        ...state,
        latestDeliveryFailed: initialState.latestDeliveryFailed
      };
    case REVISION_OFFICE_MANAGER_ACTION_TYPE.RESET_UI:
      return initialState;
    default:
      return state;
  }
}
