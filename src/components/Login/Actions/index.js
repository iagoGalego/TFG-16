import LOGIN_TYPES from './types'
import HMBAPI from '../../../common/lib/API'
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

function getLoggedUserSuccess(loggedUser) {
    return {
        type: LOGIN_TYPES.LOGGED_USER_REQUEST_SUCCESS,
        payload: {
            loggedUser: loggedUser
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

export function login(user, pass) {
    return dispatch => {
        dispatch(requestAPICall())

        return HMBAPI.instance
            .login({user, pass})
            .then( token => {
                sessionStorage.setItem('__token', token);
                dispatch(loginSuccess(token))
            })
            .then(() => HMBAPI.instance.loadUserConfiguration(user) )
            .then(config => window.localStorage.setItem('config', JSON.stringify(config)))
            .catch( err => dispatch(requestAPIError(err)) )
    }
}

export function getLoggedUser() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .DB.client.loggedUser.get()
            .then( response => {
                sessionStorage.setItem('__loggedUser', JSON.stringify(response.content));
                dispatch(getLoggedUserSuccess(response.content))
            })
            .catch( err => dispatch(requestAPIError(err)) )
    }
}

export function logout() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .logout()
            .then( () => {
                sessionStorage.removeItem('__token');
                sessionStorage.removeItem('__loggedUser');
                dispatch(logoutSuccess());
            })
            .catch( err => dispatch(requestAPIError(err)) )
    }
}

export function setError( errorMessage ){
    return {
        type: LOGIN_TYPES.SET_ERROR,
        payload: { errorMessage }
    }
}