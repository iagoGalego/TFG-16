import LOGIN_TYPES from './types'
import HMBAPI from '../../../common/lib/QuestionnairesAPI'
import { Logger, LEVELS } from '../../../common/lib/Logger'

function loginSuccess() {
    return {
        type: LOGIN_TYPES.REQUEST_SUCCESS,
        payload: {
            isAuthenticated: true,
            hasLoggedOut: false
        }
    }
}

function logoutSuccess() {
    return {
        type: LOGIN_TYPES.REQUEST_SUCCESS,
        payload: {
            isAuthenticated: false,
            hasLoggedOut: true
        }
    }
}

function requestAPICall(){
    return {
        type: LOGIN_TYPES.REQUEST
    }
}

function requestAPIError(err) {
    if(!err.message.includes('401'))
        Logger.instance.log(LEVELS.ERROR, 'Error on API request', err)

    return {
        type: LOGIN_TYPES.REQUEST_FAILURE,
        payload : {
            err
        }
    }
}

export function loginQuestionnaires(user, pass) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .login({user, pass})
            .then( token => {
                sessionStorage.setItem('__questionnairesToken', token);
                dispatch(loginSuccess(token))
            })
            .then(() => HMBAPI.instance.loadUserConfiguration(user) )
            .then(config => window.localStorage.setItem('questionnairesConfig', JSON.stringify(config)))
            .catch( err => dispatch(requestAPIError(err)) )
    }
}

export function logoutQuestionnaires() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .logout()
            .then( () => {
                sessionStorage.removeItem('__questionnairesToken')
                dispatch(logoutSuccess())
            })
            .catch( err => dispatch(requestAPIError(err)) )
    }
}

export function setErrorQuestionnaires( errorMessage ){
    return {
        type: LOGIN_TYPES.SET_ERROR,
        payload: { errorMessage }
    }
}