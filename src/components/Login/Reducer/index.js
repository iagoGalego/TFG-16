/**
 * Created by victorjose.gallego on 2/4/16.
 */
import TYPES from '../Actions/types'

const InitialState = {
    isFetching: false,
    err : null,
    showErrorMessages: false,
    isAuthenticated: !!sessionStorage.getItem('__token'),
    loggedUser: JSON.parse(sessionStorage.getItem('__loggedUser')),
    hasLoggedOut: false,
};

export default function LoginReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    switch (type){
        case TYPES.REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case TYPES.REQUEST_SUCCESS:
            return {
                ...state,
                isAuthenticated: payload.isAuthenticated,
                hasLoggedOut: payload.hasLoggedOut,
                isFetching: false,
                err: null
            }
        case TYPES.LOGGED_USER_REQUEST_SUCCESS:
            return {
                ...state,
                loggedUser: payload.loggedUser,
                isFetching: false,
                err: null
            }
        case TYPES.REQUEST_FAILURE:
            return {
                ...state,
                isFetching: false,
                err: payload.err
            }
        case TYPES.SET_ERROR:
            return {
                ...state,
                err: payload.errorMessage
            }
        default:
            return state
    }
}