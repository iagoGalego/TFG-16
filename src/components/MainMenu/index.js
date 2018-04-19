import React, {Component} from 'react'
import { NavLink } from 'react-router-dom';
import CSSModules from 'react-css-modules'

import { injectIntl, defineMessages } from 'react-intl'

import { List, ListItem } from 'react-toolbox/lib/list'

import styles from './styles.scss'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setAppLanguage, setTitle, toggleMenu, toggleSettingsPanel} from "../Layout/Actions";
import {login, logout, setError} from "../Login/Actions";

const messages = defineMessages({
    home: {
        id: 'main.menu.home',
        description: 'Main menu home link',
        defaultMessage: 'Home',
    },
    about: {
        id: 'main.menu.about',
        description: 'Main menu about link',
        defaultMessage: 'About',
    },
    games: {
        id: 'main.menu.games',
        description: 'Main menu games link',
        defaultMessage: 'Games',
    },
    questionnaires: {
        id: 'main.menu.questionnaires',
        description: 'Main menu questionnaires link',
        defaultMessage: 'Questionnaires',
    }
});

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
@CSSModules(styles)
@connect(mapStateToProps, mapDispatchToProps)
class MainMenu extends Component{

    constructor(props, context) {
        super(props, context);
    }


    render(){
        const {intl : {formatMessage} } = this.props;

        return(
            <List className = { styles['menu'] } ripple selectable>
                <NavLink to = '/app/dashboard' activeClassName = { styles['active'] }>
                    <ListItem caption = {formatMessage(messages.home)} leftIcon = 'home' />
                </ NavLink>
                <NavLink to = '/app/games' activeClassName = { styles['active'] }>
                    <ListItem caption = {formatMessage(messages.games)} leftIcon = 'videogame_asset' />
                </ NavLink>
                <NavLink to = '/app/questionnaires' activeClassName = { styles['active'] }>
                    <ListItem caption = {formatMessage(messages.questionnaires)} leftIcon = 'assignment' />
                </ NavLink>
                <NavLink to = '/app/about' activeClassName = { styles['active'] }>
                    <ListItem caption = {formatMessage(messages.about)} leftIcon = 'info' />
                </ NavLink>
            </List>
        )
    }
}
export default injectIntl(MainMenu)