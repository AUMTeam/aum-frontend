import { COMMON_ELEMENT_ATTRIBUTE, APPROVAL_STATUS } from '../constants/elements';
import React from 'react';
import ApprovalStatusIcon from '../components/ApprovalStatusIcon';

/**
 * Gets the filter object corresponding to the given search term.
 * The filter logic is common so we can change the behavior globally without any inconsistencies.
 * @param {*} searchQuery the searched term
 */
export function getSearchFilterOrDefault(searchQuery, defaultFilter = {}) {
  if (searchQuery != null && searchQuery !== '')
    return {
      attribute: COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION,
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

/**
 * Renders the content of a cell accordingly to its column.
 * Needed for those columns which display icons or format values in some way
 */
export function renderCellContentCommon(columnKey, value, elementId) {
  switch (columnKey) {
    case COMMON_ELEMENT_ATTRIBUTE.AUTHOR:
      return value.name;
    case COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS:
      return <ApprovalStatusIcon status={+value} />;
    case COMMON_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP:
    case COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP:
      return value ? new Date(value * 1000).toLocaleString('it-it') : '—';
    default:
      return value;
  }
}
