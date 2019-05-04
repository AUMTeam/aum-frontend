/**
 * @file
 * Includes functions used in several views and sometimes in their child components (like tables, dialogs etc.).
 */

import React from 'react';
import ApprovalStatusIcon from '../components/ApprovalStatusIcon';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE, INSTALL_TYPE } from '../constants/elements';
import { INSTALL_TYPE_LABEL } from '../constants/elements';

export function retrieveElementFromListState(state, elementId, pageNumber, rowIndex = null) {
  if (pageNumber != null && rowIndex != null) {
    const element = state.listPages[pageNumber].data[rowIndex];
    return { ...element };
  } else if (pageNumber != null && elementId != null) {
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
  const PLACEHOLDER_CHARACTER = '—';
  if (value == null)
    return PLACEHOLDER_CHARACTER;

  switch (attributeKey) {
    case COMMON_ELEMENT_ATTRIBUTE.APPROVER:
    case COMMON_ELEMENT_ATTRIBUTE.AUTHOR:
      return value.name;
    case COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS:
      return <ApprovalStatusIcon status={+value} />;
    case COMMON_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP:
    case COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP:
    case SEND_REQUEST_ATTRIBUTE.DELIVERY_TIMESTAMP:
      return new Date(value * 1000).toLocaleString('it-it');
    case SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE:
      return INSTALL_TYPE.DURING_EXECUTION ? INSTALL_TYPE_LABEL.DURING_EXECUTION : INSTALL_TYPE_LABEL.NEEDS_SHUTDOWN;
    // prettier-ignore
    case SEND_REQUEST_ATTRIBUTE.LINKED_COMMITS:
      if (value.length === 0)
          return PLACEHOLDER_CHARACTER;
      else {
        let commits = '';
        value.forEach((element, index) => {
          commits += `${element[COMMON_ELEMENT_ATTRIBUTE.TITLE]} (#${element[COMMON_ELEMENT_ATTRIBUTE.ID]})`
          if (index < value.length-1)
            commits += ', ';
        });
        return commits;
      }
    // prettier-ignore
    case SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS:
      if (value.length === 0)
        return PLACEHOLDER_CHARACTER;
      else {
        let clients = '';
        value.forEach((element, index) => {
          clients += element.name;
          if (index < value.length-1)
            clients += ', ';
        });
        return clients;
      }
    default:
      return value;
  }
}
