/**
 * Created by victorjose.gallego on 2/4/16.
 */
import TYPES from '../Actions/types'

const InitialState = {
    dialogOpened : false
}

export default function GraphReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    switch (type){
        case TYPES.TOGGLE_DIALOG:
            return {
                ...state,
                dialogOpened: !state.dialogOpened
            }
        default:
            return state
    }
}