import { LIST_ELEMENT_ATTRIBUTE, APPROVAL_STATUS } from '../constants/listElements';

/**
 * Gets the filter object corresponding to the given search term.
 * The filter logic is common so we can change the behavior globally without any inconsistencies.
 * @param {*} searchQuery the searched term
 */
export function getSearchFilterOrDefault(searchQuery, defaultFilter = {}) {
  if (searchQuery != null && searchQuery !== '')
    return {
      attribute: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION,
      valueMatches: searchQuery
    };
  else return defaultFilter;
}

export function isSearchFilter(filter) {
  return filter.attribute === getSearchFilterOrDefault('Test query').attribute;
}

/**
 * Gets the filter object used to display items which have been already reviewed
 */
export function getHistoryFilter() {
  return {
    attribute: LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS,
    valueDifferentFrom: APPROVAL_STATUS.PENDING
  };
}

/**
 * Gets the filter object used to display items which needs to be reviewed
 */
export function getToBeReviewedFilter() {
  return {
    attribute: LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS,
    valueMatches: APPROVAL_STATUS.PENDING
  };
}

export function getEmptySortingCriteria() {
  return {
    columnKey: null,
    direction: 'desc'
  };
}
