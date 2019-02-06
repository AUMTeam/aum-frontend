/**
 * List of attributes which are common between commits and send requests
 */
export const LIST_ELEMENT_ATTRIBUTE = {
  ID: 'id',
  DESCRIPTION: 'description',
  TIMESTAMP: 'timestamp',
  UPDATE_TIMESTAMP: 'update_timestamp',
  AUTHOR: 'author',
  APPROVAL_STATUS: 'approval_status'
};

export const APPROVAL_STATUS = {
  APPROVED: 1,
  PENDING: 0,
  REJECTED: -1
};