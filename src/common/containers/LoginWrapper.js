import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Login from '../../components/Login'
import {login, logout, setError} from '../../components/Login/Actions'
import {loginQuestionnaires, logoutQuestionnaires, setErrorQuestionnaires} from '../../components/Questionnaires/Actions'
import {setAppLanguage, setTitle} from "../../components/Layout/Actions";

class LoginWrapper extends Component {
    constructor() {
        super();
    }

    render() {
        return <Login {...this.props}/>
    }
}

function mapStateToProps(state) {
    return {
        ...state.AuthState,
        language: state.UIState.language,
        title: state.UIState.title,
        isAuthenticated: state.AuthState.isAuthenticated,
        hasLoggedOut: state.AuthState.hasLoggedOut
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(login, dispatch),
        logout: bindActionCreators(logout, dispatch),
        setError: bindActionCreators(setError, dispatch),
        loginQuestionnaires: bindActionCreators(loginQuestionnaires, dispatch),
        logoutQuestionnaires: bindActionCreators(logoutQuestionnaires, dispatch),
        setErrorQuestionnaires: bindActionCreators(setErrorQuestionnaires, dispatch),
        changeLanguage: bindActionCreators(setAppLanguage, dispatch),
        setAppTitle: bindActionCreators(setTitle, dispatch),

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginWrapper);