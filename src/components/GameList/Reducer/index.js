import TYPES from '../Actions/types'

const InitialState = {
}

export default function GameListReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    switch (type){
        default:
            return state
    }
}
