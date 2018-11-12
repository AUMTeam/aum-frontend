import { COMMITS_ACTION_TYPE_KEYS } from '../actions/commits';

export const initialState = {
  listPages: [
    {
      data: [],
      updateTimestamp: 0
    }
  ],
  latestUpdateTimestamp: 0,
  totalCommitsCount: 0,
  currentlyShowingPage: 0,
  currentlyShowingCommit: null,
  actionPending: false,
  isLoadingList: false
};

export function commits(state = initialState, action) {
  switch (action.type) {
    case COMMITS_ACTION_TYPE_KEYS.PERFORMING_REQUEST:
      return {
        ...state,
        actionPending: true
      }
    case COMMITS_ACTION_TYPE_KEYS.COMMITS_LIST_PAGE_REQUEST:
      return {
        ...state,
        isLoadingList: true
      }
    default:
      return state;
  }
}