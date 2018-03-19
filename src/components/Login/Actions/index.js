/**
 * Created by victorjose.gallego on 2/4/16.
 */

import LOGIN_TYPES from './types'
import HMBAPI from '../../../common/lib/API'
import { Logger, LEVELS } from '../../../common/lib/Logger'

function requestAPICall(){
    return {
        type: LOGIN_TYPES.REQUEST
    }
}

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

export function logout() {
    return dispatch => {
        dispatch(requestAPICall())

        return HMBAPI.instance
            .logout()
            .then( () => {
                sessionStorage.removeItem('__token')
                dispatch(logoutSuccess())
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