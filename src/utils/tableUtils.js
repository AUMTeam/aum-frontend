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

export function getEmptySortingCriteria() {
  return {
    columnKey: null,
    direction: 'desc'
  };
}

/**
 * Used in RevisionTable
 */
export function getAlreadyReviewedFilter() {
  return {
    attribute: LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS,
    valueDifferentFrom: APPROVAL_STATUS.PENDING
  };
}

export function getToBeReviewedFilter() {
  return {
    attribute: LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS,
    valueMatches: APPROVAL_STATUS.PENDING
  };
}

/**
 * Used in DeliveryTable
 */
export function getToBeDeliveredFilter() {
  return {}; // TODO
}

export function getAlreadyDeliveredFilter() {
  return {}; // TODO
}