import { AUTH_ACTION_TYPE_KEYS } from '../actions/auth';
import { COMMITS_ACTION_TYPE_KEYS } from '../actions/commits';

const initialState = {
  /*
    listPages will contain objects with the following shape:
    {
      data: [],             -- the list of commits for the page
      updateTimestamp: 0    -- the value of state.latestCommitTimestamp when the page was retrieved
    }
  */
  listPages: [],
  latestCommitTimestamp: 0, // timestamp of the most recent commit, used to check if there have been updates remotely
  totalCommitsCount: 0,
  currentlyShowingCommit: null,
  isLoadingList: true,
  errorWhileFetchingData: false,
  errorWhileCheckingUpdates: false
};

export function commits(state = initialState, action) {
  switch (action.type) {
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_REQUEST:
      return {
        ...state,
        errorWhileFetchingData: false,
        isLoadingList: true
      };
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_RETRIEVED_FROM_SERVER:
      const newState = {
        ...state,
        isLoadingList: false,
        totalCommitsCount: action.serverResponse.count_total
      };
      newState.listPages = [...state.listPages];   // objects are not deeply copied, that would just be too painful
      if (!(action.pageNumber in newState.listPages) || newState.listPages[action.pageNumber] == null)
        newState.listPages[action.pageNumber] = {};
      newState.listPages[action.pageNumber].data = action.serverResponse.list;

      // Here we assume that the latestCommitTimestamp value is always correctly initialized,
      // because update checking always happens before retrieving a page
      newState.listPages[action.pageNumber].updateTimestamp =
        newState.latestCommitTimestamp;
      return newState;
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_RETRIEVAL_ERROR:
      return {
        ...state,
        errorWhileFetchingData: true,
        isLoadingList: false
      };
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_NO_RETRIEVAL_NEEDED:
      return {
        ...state,
        isLoadingList: false
      };
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_UPDATE_CHECKING_ERROR:
      return {
        ...state,
        errorWhileCheckingUpdates: true
      };
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_UPDATE_RECEIVED:
      return {
        ...state,
        errorWhileCheckingUpdates: false,
        latestCommitTimestamp: action.latestCommitTimestamp
      };
    case AUTH_ACTION_TYPE_KEYS.LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
