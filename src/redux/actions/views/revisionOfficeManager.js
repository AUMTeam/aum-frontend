export const REVISION_OFFICE_MANAGER_ACTION_TYPE = {
  ELEMENT_DELIVERY_SUCCESSFUL: 'TECH_AREA_ELEMENT_DELIVERY_SUCCESSFUL',
  RESET_UI: 'REV_OFFICE_RESET_UI'
};

export function deliverElementAction(elementId, deliveryUrl) {
  return {
    type: REVISION_OFFICE_MANAGER_ACTION_TYPE.ELEMENT_DELIVERY_SUCCESSFUL,
    elementId,
    deliveryUrl
  };
}