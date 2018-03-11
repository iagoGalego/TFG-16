import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Layout from '../../components/Layout'
import {setAppLanguage, setTitle, toggleMenu, toggleSettingsPanel} from '../../components/Layout/Actions'
import LoginWrapper from "./LoginWrapper";
import About from '../../components/About'
import Home from '../../components/Home'
import Games from '../../components/Games'
import NotFound from '../../components/NotFound'

import { Switch } from 'react-router'
import { Route, Redirect} from "react-router-dom";
import {login, logout, setError} from "../../components/Login/Actions";

class LayoutWrapper extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Layout {...this.props}>
                <Switch>
                    <Route path='/app/dashboard' component = { Home } />
                    <Redirect exact from = '/app' to='/app/dashboard' />
                    <Route path = '/app/games' component = { Games } />
                    <Route path = '/app/about' component = { About } />
                    <Route path = '/app/404' component = { NotFound } />
                    <Redirect from = '*' to='404' />
                </Switch>
            </Layout>
        )
    }
}

function mapStateToProps(state) {
    return {
        ...state.AuthState,
        language: state.UIState.language,
        title: state.UIState.title,
        isAuthenticated: state.AuthState.isAuthenticated,
        hasLoggedOut: state.AuthState.hasLoggedOut,
        menuOpened: state.UIState.isMenuOpened,
        settingsPanelOpened:state.UIState.isSettingsPanelOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(login, dispatch),
        logout: bindActionCreators(logout, dispatch),
        setError: bindActionCreators(setError, dispatch),
        changeLanguage: bindActionCreators(setAppLanguage, dispatch),
        setAppTitle: bindActionCreators(setTitle, dispatch),
        toggleMenu: bindActionCreators(toggleMenu, dispatch),
        toggleSettingsPanel: bindActionCreators(toggleSettingsPanel, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LayoutWrapper);