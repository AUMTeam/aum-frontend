import { PROGRAMMER_ACTION_TYPE } from "../../actions/views/programmer";

const initialState = {
    isAddingData: false,
    additionError: false
}

export function programmerViewReducer(state = initialState, action) {
    switch (action.type) {
        case PROGRAMMER_ACTION_TYPE.ADD_ELEMENT:
            return {
                ...state,
                isAddingData: true,
                additionError: false
            }
        case PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_SUCCESSFUL: 
            return {
                ...state,
                isAddingData: false,
                additionError: false
            }
        case PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_FAILED:
            return {
                ...state,
                isAddingData: false,
                additionError: true
            }    
        default:
            return state;    
    }
}