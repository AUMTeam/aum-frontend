import { LIST_ACTION_TYPE } from './lists';

export function search(searchQuery) {
  return {
    type: LIST_ACTION_TYPE.ON_SEARCH_QUERY_CHANGED,
    searchQuery
  };
}
