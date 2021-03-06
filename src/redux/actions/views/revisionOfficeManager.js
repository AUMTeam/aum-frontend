export const REVISION_OFFICE_MANAGER_ACTION_TYPE = {
  ELEMENT_DELIVERY_REQUEST: 'REV_OFFICE_ELEMENT_DELIVERY_REQUEST',
  ELEMENT_DELIVERY_SUCCESSFUL: 'REV_OFFICE_ELEMENT_DELIVERY_SUCCESSFUL',
  ELEMENT_DELIVERY_FAILED: 'REV_OFFICE_ELEMENT_DELIVERY_FAILED',
  RESET_FAILED_DELIVERY_FLAG: 'REV_OFFICE_RESET_FAILED_DELIVERY_FLAG',
  RESET_UI: 'REV_OFFICE_RESET_UI'
};

export function deliverElementAction(elementId, installLink) {
  return {
    type: REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_REQUEST,
    elementId,
    installLink
  };
}