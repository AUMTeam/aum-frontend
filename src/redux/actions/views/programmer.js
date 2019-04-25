export const PROGRAMMER_ACTION_TYPE = {
    ADD_ELEMENT: "ADD_ELEMENT",
    ADD_ELEMENT_SUCCESSFUL: "ADD_ELEMENT_SUCCESSFUL",
    ADD_ELEMENT_FAILED: "ADADD_ELEMENT_FAILEDD_NEW_SEND_REQUEST_FAILED"
}

export function addElement(elementType, payload) {
    return {
        type: PROGRAMMER_ACTION_TYPE.ADD_NEW_SEND_REQUEST,
        elementType,
        payload
    }
}