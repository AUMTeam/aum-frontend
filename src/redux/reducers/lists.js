import { AUTH_ACTION_TYPE } from '../actions/auth';
import { LIST_ACTION_TYPE } from '../actions/lists';

const initialState = {
  /*
    listPages will contain objects with the following shape:
    {
      data: [],             -- the list of commits for the page
      sorting: {},
      searchQuery: '',
      updateTimestamp: 0    -- the value of state.latestUpdateTimestamp when the page was retrieved
    }
  */
  listPages: [],
  latestUpdateTimestamp: 0, // timestamp of the most recent commit, used to check if there have been updates remotely
  totalItemsCount: 0,
  currentlyShowingItem: null,
  isLoadingList: true,
  errorWhileFetchingData: false,
  errorWhileCheckingUpdates: false
};

export function listReducer(state = initialState, action) {
  switch (action.type) {
    case LIST_ACTION_TYPE.SEARCH_QUERY_CHANGED:
    case LIST_ACTION_TYPE.PAGE_REQUEST:
      return {
        ...state,
        errorWhileFetchingData: false,
        isLoadingList: true
      };
    case LIST_ACTION_TYPE.PAGE_RETRIEVED_FROM_SERVER:
      const newState = {
        ...state,
        isLoadingList: false,
        totalItemsCount: action.serverResponse.count_total
      };
      newState.listPages = [...state.listPages]; // objects are not deeply copied, that would just be too painful
      if (newState.listPages[action.pageNumber] == null)
        newState.listPages[action.pageNumber] = {};
      newState.listPages[action.pageNumber].data = action.serverResponse.list;

      newState.listPages[action.pageNumber].sorting = action.sortingCriteria;
      newState.listPages[action.pageNumber].searchQuery = action.searchQuery;

      // Here we assume that the latestUpdateTimestamp value is always correctly initialized,
      // because update checking always happens before retrieving a page
      newState.listPages[action.pageNumber].updateTimestamp = newState.latestUpdateTimestamp;
      return newState;
    case LIST_ACTION_TYPE.PAGE_RETRIEVAL_ERROR:
      return {
        ...state,
        errorWhileFetchingData: true,
        isLoadingList: false
      };
    case LIST_ACTION_TYPE.NO_RETRIEVAL_NEEDED:
      return {
        ...state,
        isLoadingList: false
      };
    case LIST_ACTION_TYPE.UPDATE_CHECKING_ERROR:
      return {
        ...state,
        errorWhileCheckingUpdates: true
      };
    case LIST_ACTION_TYPE.UPDATE_RECEIVED:
      return {
        ...state,
        errorWhileCheckingUpdates: false,
        latestUpdateTimestamp: action.latestUpdateTimestamp
      };
    case AUTH_ACTION_TYPE.LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
