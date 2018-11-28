import { GLOBAL_ERROR_ACTION_TYPE_KEYS } from '../actions/globalError';

const initialState = null;

/**
 * Reducer used to report global errors, e.g. Saga failures
 */
export function globalError(state = initialState, action) {
  switch (action.type) {
    case GLOBAL_ERROR_ACTION_TYPE_KEYS.SAGA_ERROR:
      return {
        module: 'saga'
      };
    default:
      return state;
  }
}
