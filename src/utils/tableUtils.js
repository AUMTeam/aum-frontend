/**
 * @file
 * Includes functions used by table components to perform their operations.
 */

import { COMMON_ELEMENT_ATTRIBUTE, APPROVAL_STATUS } from '../constants/elements';

/**
 * Gets the filter object corresponding to the given search term.
 * The filter logic is common so we can change the behavior globally without any inconsistencies.
 * @param {*} searchQuery the searched term
 */
export function getSearchFilterOrDefault(searchQuery, defaultFilter = {}) {
  if (searchQuery != null && searchQuery !== '')
    return {
      attribute: COMMON_ELEMENT_ATTRIBUTE.TITLE,
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
    attribute: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS,
    valueDifferentFrom: APPROVAL_STATUS.PENDING
  };
}

export function getToBeReviewedFilter() {
  return {
    attribute: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS,
    valueMatches: APPROVAL_STATUS.PENDING
  };
}

/**
 * Used in DeliveryTable
 */
export function getToBeDeliveredFilter() {
  return {
    attribute: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS,
    valueDifferentFrom: APPROVAL_STATUS.DELIVERED
  };
}

export function getAlreadyDeliveredFilter() {
  return {
    attribute: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS,
    valueMatches: APPROVAL_STATUS.DELIVERED
  };
}
