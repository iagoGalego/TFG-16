import TYPES from '../Actions/types'

const InitialState = {
    graph : {'desc': 'grafo inicial'},
}

export default function GraphReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    switch (type){
        case TYPES.TOGGLE_DIALOG:
            return {
                ...state,
                dialogOpened: !state.dialogOpened
            };
        default:
            return state
    }
}