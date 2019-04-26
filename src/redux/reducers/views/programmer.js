import { PROGRAMMER_ACTION_TYPE } from '../../actions/views/programmer';
import { ALL_ELEMENT_TYPE } from '../../../constants/api';

const initialState = {
  isAddingData: false,
  additionError: false,
  isLoadingClients: false,
  allClients: [],
  isLoadingBranches: false,
  allBranches: [],
  isLoadingCommits: false,
  allCommits: []
};

export function programmerViewReducer(state = initialState, action) {
  switch (action.type) {
    case PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_REQUEST:
      return {
        ...state,
        isAddingData: true,
        additionError: false
      };
    case PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_SUCCESSFUL:
      return {
        ...state,
        isAddingData: false,
        additionError: false
      };
    case PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_FAILED:
      return {
        ...state,
        isAddingData: false,
        additionError: true
      };
    case PROGRAMMER_ACTION_TYPE.GET_ALL_REQUEST:
      return handleGetAll(state, action.elementType, true);
    case PROGRAMMER_ACTION_TYPE.GET_ALL_SUCCESSFUL:
      return handleGetAllSuccessful(state, action.elementType, action.payload)
    case PROGRAMMER_ACTION_TYPE.GET_ALL_FAILED:
      return handleGetAll(state, action.elementType, false);
    default:
      return state;
  }
}

function handleGetAll(state, elementType, isRequest) {
  switch (elementType) {
    case ALL_ELEMENT_TYPE.CLIENTS:
      return {
        ...state,
        isLoadingClients: isRequest,
        allClients: []
      };
    case ALL_ELEMENT_TYPE.BRANCHES:
      return {
        ...state,
        isLoadingBranches: isRequest,
        allBranches: []
      };
    case ALL_ELEMENT_TYPE.COMMITS:
      return {
        ...state,
        isLoadingCommits: isRequest,
        allCommits: []
      };
  }
}

function handleGetAllSuccessful(state, elementType, payload) {
    switch (elementType) {
        case ALL_ELEMENT_TYPE.CLIENTS:
          return {
            ...state,
            isLoadingClients: false,
            allClients: payload
          };
        case ALL_ELEMENT_TYPE.BRANCHES:
          return {
            ...state,
            isLoadingBranches: false,
            allBranches: payload
          };
        case ALL_ELEMENT_TYPE.COMMITS:
          return {
            ...state,
            isLoadingCommits: false,
            allCommits: payload
          };
      }
}
