import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import { createChild } from '../utils'
import {setAppLanguage, setTitle} from '../../components/Layout/Actions'
import { logout } from '../../components/Login/Actions'

import HMBAPI from '../lib/API'

import styles from '../styles/styles.scss'

@CSSModules(styles)
class App extends Component {
    constructor() {
        super();

        if(!!sessionStorage.getItem('__token')){
            HMBAPI.init(sessionStorage.getItem('__token'))
        }
    }

    render() {
        const { children } = this.props;

        return createChild(children, this.props);
    }
}

function mapStateToProps(state) {
    return {
        language : state.UIState.language,
        title: state.UIState.title,
        isAuthenticated: state.AuthState.isAuthenticated,
        hasLoggedOut: state.AuthState.hasLoggedOut,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeLanguage: bindActionCreators(setAppLanguage, dispatch),
        setAppTitle: bindActionCreators(setTitle, dispatch),
        logout: bindActionCreators(logout, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
