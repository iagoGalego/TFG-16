import PropTypes from 'prop-types';
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createChild } from '../../common/utils'
import CSSModules from 'react-css-modules'
import { autobind } from 'core-decorators'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { Button, IconButton } from 'react-toolbox/lib/button'
import { Layout, NavDrawer, Panel } from 'react-toolbox/lib/layout'
import { Navigation } from 'react-toolbox/lib/navigation'
import Settings from '../Settings'

import styles from './styles.scss'
import Logo from '../../common/img/logo-vertical.png'
import TinyLogo from '../../common/img/logo-tiny.png'
import MainMenu from '../MainMenu'

@CSSModules(styles)
@autobind class CustomLayout extends Component {
    constructor(props, context) {
        super(props, context);
        this.authenticate(props);
        this.lang = this.props.language;
    }
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        this.authenticate(nextProps)
    }

    authenticate(props) {
        if (!props.isAuthenticated) {
            this.context.router.history.push(
                props.hasLoggedOut
                    ? '/login'
                    : {
                        pathname : '/login',
                        query : {
                            target: props.location.pathname
                        }
                    }
            )
        }
    }

    handleToggleMenu(){
        if(window.innerWidth < 960){
            this.props.toggleMenu()
        }
    }
    handleLogoutButtonClick(){
        this.props.logout().then(
            () => {
                this.props.logoutQuestionnaires()
            }
        )
    }
    handleToggleSettings(){
        this.props.changeLanguage(this.lang);
        this.props.toggleSettingsPanel()
    }
    handleSaveSettings(){
        this.lang = this.props.language;
        this.props.toggleSettingsPanel()
    }
    handleShrinkDrawer(){
        ReactDOM.findDOMNode(this.__drawer).classList.toggle(styles['shrink']);
        ReactDOM.findDOMNode(this.__panel).classList.toggle(styles['panel']);
    }

    componentDidMount() {
    const panel = ReactDOM.findDOMNode(this.__panel);
    window.addEventListener('resize', function(){
            if(window.innerWidth < 960){
                panel.classList.remove(styles['panel'])
            }
        }, true);
    }

    render(){
        const { language, title, menuOpened, settingsPanelOpened, changeLanguage, children } = this.props;

        return (
            <div styleName = 'root'>
                <Layout>
                    <NavDrawer
                        ref = { elem => this.__drawer = elem }
                        active = { menuOpened }
                        permanentAt = 'md'
                        styleName = 'drawer'
                        onOverlayClick = { this.handleToggleMenu }>

                        <header>
                            <img src = { Logo } styleName = 'logo' />
                            <img src = { TinyLogo } styleName= 'tinyLogo' />
                        </header>
                        <MainMenu />
                        <Navigation styleName = 'buttons' type='horizontal'>
                            <Button icon='settings' flat onClick = { this.handleToggleSettings } />
                            <Button icon='exit_to_app' flat onClick = { this.handleLogoutButtonClick } />
                        </Navigation>
                        <Button styleName='minimizer' icon='chevron_left' flat onClick = { this.handleShrinkDrawer } />
                    </NavDrawer>
                    <Panel ref = { elem => this.__panel = elem }>
                        <AppBar styleName = 'appbar'>
                            <IconButton styleName = 'menuIcon' icon = 'menu' inverse = { true } onClick = { this.handleToggleMenu }/>
                            <h1 styleName = 'windowTitle'>{ title }</h1>
                            <IconButton styleName='exitButton' icon='exit_to_app' onClick = { this.handleLogoutButtonClick }/>
                        </AppBar>

                        <div styleName = 'main'>
                            { createChild(children, {setAppTitle: this.props.setAppTitle}) }
                        </div>
                    </Panel>
                </Layout>

                <Settings active = {settingsPanelOpened}
                          onCancel = { this.handleToggleSettings }
                          onSave = { this.handleSaveSettings }
                          language = { language }
                          setLanguage = { changeLanguage }
                          lang = { this.lang }
                />
            </div>
        )
    }
}

export default CustomLayout