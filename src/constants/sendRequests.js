import { APPROVAL_STATUS as approvalStatus } from "./commits";

/**
 * List of fields contained in sendRequests objects
 */
export const SEND_REQUESTS_ATTRIBUTE = {
  ID: 'id',
  DESCRIPTION: 'description',
  TIMESTAMP: 'timestamp',
  AUTHOR: 'author',
  APPROVAL_STATUS: 'approval_status'
};

export const APPROVAL_STATUS = approvalStatus;