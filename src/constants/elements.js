/**
 * List of attributes which are common between commits and send requests
 */
export const COMMON_ELEMENT_ATTRIBUTE = {
  ID: 'id',
  TITLE: 'title',
  DESCRIPTION: 'description',
  COMPONENTS: 'components',
  TIMESTAMP: 'timestamp',
  UPDATE_TIMESTAMP: 'update_timestamp',
  AUTHOR: 'author',
  APPROVAL_STATUS: 'approval_status',
  APPROVER: 'approver',
  BRANCH: 'branch'
};

export const SEND_REQUEST_ATTRIBUTE = {
  INSTALL_LINK: 'install_link',
  INSTALL_TYPE: 'install_type'
}

export const INSTALL_TYPE = {
  DURING_EXECUTION: 0,
  NEEDS_SHUTDOWN: 1
}

export const APPROVAL_STATUS = {
  DELIVERED: 2,
  APPROVED: 1,
  PENDING: 0,
  REJECTED: -1,
};