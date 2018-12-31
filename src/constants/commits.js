/**
 * List of fields contained in commits objects
 */
export const COMMITS_ATTRIBUTE = {
  ID: 'id',
  DESCRIPTION: 'description',
  TIMESTAMP: 'timestamp',
  AUTHOR: 'author',
  APPROVAL_STATUS: 'approval_status'
};

// Used for send requests too
export const APPROVAL_STATUS = {
  APPROVED: 1,
  PENDING: 0,
  REJECTED: -1
};