import { COMMITS_ACTION_TYPE_KEYS } from '../actions/commits';

export const initialState = {
  list: null,
  currentRev: null,
  currentlyEditingCommit: null,
  currentlyShowingCommit: null,
  actionPending: false
};

export function commits(state = initialState, action) {
  switch (action.type) {
    case COMMITS_ACTION_TYPE_KEYS.PERFORMING_REQUEST:
      return {
        ...state,
        actionPending: true
      }
    default:
      return state;
  }
}