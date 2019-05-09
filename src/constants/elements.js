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
  LINKED_COMMITS: 'commits',
  RECIPIENT_CLIENTS: 'clients',
  INSTALL_LINK: 'install_link',
  INSTALL_TYPE: 'install_type',
  INSTALL_TIMESTAMP: 'install_timestamp',
  INSTALL_STATUS: 'install_status',
  INSTALL_FEEDBACK: 'install_comment',
  DELIVERY_TIMESTAMP: 'send_timestamp'
};

export const ATTRIBUTE_LABEL = {
  [COMMON_ELEMENT_ATTRIBUTE.ID]: 'ID',
  [COMMON_ELEMENT_ATTRIBUTE.TITLE]: 'Titolo',
  [COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION]: 'Descrizione',
  [COMMON_ELEMENT_ATTRIBUTE.COMPONENTS]: 'Componenti',
  [COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP]: 'Data creazione',
  [COMMON_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP]: 'Data revisione',
  [COMMON_ELEMENT_ATTRIBUTE.AUTHOR]: 'Autore',
  [COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS]: 'Approvato',
  [COMMON_ELEMENT_ATTRIBUTE.APPROVER]: 'Approvato da',
  [COMMON_ELEMENT_ATTRIBUTE.BRANCH]: 'Branch',
  [SEND_REQUEST_ATTRIBUTE.LINKED_COMMITS]: 'Commit inclusi',
  [SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS]: 'Clienti destinatari',
  [SEND_REQUEST_ATTRIBUTE.INSTALL_LINK]: 'Link di installazione',
  [SEND_REQUEST_ATTRIBUTE.INSTALL_TIMESTAMP]: 'Data di installazione',
  [SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE]: 'Tipo di installazione',
  [SEND_REQUEST_ATTRIBUTE.INSTALL_STATUS]: 'Installazione effettuata',
  [SEND_REQUEST_ATTRIBUTE.INSTALL_FEEDBACK]: 'Feedback post-installazione',
  [SEND_REQUEST_ATTRIBUTE.DELIVERY_TIMESTAMP]: 'Inviato il'
};

export const INSTALL_TYPE = {
  DURING_EXECUTION: 0,
  NEEDS_SHUTDOWN: 1
};

export const INSTALL_TYPE_LABEL = {
  DURING_EXECUTION: 'A caldo',
  NEEDS_SHUTDOWN: 'A freddo'
};

export const INSTALL_STATUS = {
  INSTALL_FAILED: -1,
  NOT_YET_INSTALLED: 0,
  INSTALL_SUCCESS: 1
}

export const APPROVAL_STATUS = {
  DELIVERED: 2,
  APPROVED: 1,
  PENDING: 0,
  REJECTED: -1
};

export const APPROVAL_STATUS_LABEL = {
  [APPROVAL_STATUS.DELIVERED]: 'Inviato',
  [APPROVAL_STATUS.APPROVED]: 'Approvato',
  [APPROVAL_STATUS.PENDING]: 'In attesa',
  [APPROVAL_STATUS.REJECTED]: 'Rifiutato'
}