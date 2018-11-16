import { commits } from './commits';
import { USER_TYPE_IDS, USER_ROLE_STRINGS } from '../../constants/user';

const initialState = {
  commits: undefined,
  sendRequests: undefined
}

/**
 *  This slice reducer is made to avoid commits or send requests-related actions
 *  which are not referred to programmer view polluting the state of programmer view
 */
export function programmer(state = initialState, action) {
  if (action.userRoleString) {
    if (action.userRoleString === USER_ROLE_STRINGS[USER_TYPE_IDS.PROGRAMMER]) {
      return {
        commits: commits(state.commits, action),
        //sendRequests(state.sendRequests, action)
      };
    }
    return state;
  }
  // Actions that are not view-specific must be passed in any case to sub-reducers to allow initialization
  else {
    return {
        commits: commits(state.commits, action),
        //sendRequests(state.sendRequests, action)
      };
  }
}