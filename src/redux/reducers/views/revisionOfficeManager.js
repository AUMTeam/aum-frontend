import { REVISION_OFFICE_MANAGER_ACTION_TYPE } from '../../actions/views/revisionOfficeManager';

const initialState = {
  successfullyDeliveredElements: []
};

export function revisionOfficeManagerViewReducer(state = initialState, action) {
  switch (action.type) {
    case REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_SUCCESSFUL:
      return {
        ...state,
        successfullyDeliveredElements: [...state.successfullyDeliveredElements, action.elementId]
      };
    case REVISION_OFFICE_MANAGER_ACTION_TYPE.RESET_UI:
      return initialState;
    default:
      return state;
  }
}
