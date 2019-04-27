/**
 * @file
 * Includes functions used in several views and sometimes in their child components (like tables, dialogs etc.).
 */

import React from 'react';
import ApprovalStatusIcon from '../components/ApprovalStatusIcon';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE, INSTALL_TYPE } from '../constants/elements';

export function retrieveElementFromListState(state, elementId, pageNumber, rowIndex = null) {
  if (pageNumber != null && rowIndex != null) {
    const element = state.listPages[pageNumber].data[rowIndex];
    return { ...element };
  }
  else if (pageNumber != null && elementId != null) {
    const element = state.listPages[pageNumber].data.find(element => element.id === elementId);
    return { ...element };
  }
  console.error("Couldn't retrieve element.");
  return null;
}

/**
 * Returns the printable representation of the value of the given element attribute.
 * Needed for those attributes which aren't strings or need some formatting
 */
export function renderElementFieldContent(attributeKey, value) {
  switch (attributeKey) {
    case COMMON_ELEMENT_ATTRIBUTE.APPROVER:
    case COMMON_ELEMENT_ATTRIBUTE.AUTHOR:
      return value.name;
    case COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS:
      return <ApprovalStatusIcon status={+value} />;
    case COMMON_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP:
    case COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP:
      return value ? new Date(value * 1000).toLocaleString('it-it') : '—';
    case SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE:
      return INSTALL_TYPE.DURING_EXECUTION ? 'A caldo' : 'A freddo';
    default:
      return value || '—';
  }
}