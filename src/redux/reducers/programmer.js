import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { listReducer } from './lists';

const initialState = {
  commits: undefined,
  sendRequests: undefined
};

/**
 *  This slice reducer is made to avoid commits or send requests-related actions
 *  which are not referred to programmer view polluting the state of programmer view
 */
export function programmer(state = initialState, action) {
  if ('userRoleString' in action) {
    if (action.userRoleString === USER_ROLE_STRING[USER_TYPE_ID.PROGRAMMER]) {
      return {
        commits: action.elementType === LIST_ELEMENTS_TYPE.COMMITS ? listReducer(state.commits, action) : state.commits,
        sendRequests: action.elementType === LIST_ELEMENTS_TYPE.SEND_REQUESTS ? listReducer(state.sendRequests, action) : state.sendRequests
      };
    }
    return state;
  }
  // Actions that are not view-specific must be passed in any case to sub-reducers to allow initialization
  else {
    return {
      commits: listReducer(state.commits, action),
      sendRequests: listReducer(state.sendRequests, action)
    };
  }
}
