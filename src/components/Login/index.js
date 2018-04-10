import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { defineMessages } from 'react-intl'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'

import { Navigation } from 'react-toolbox/lib/navigation'
import { Card, CardMedia, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'
import Button from 'react-toolbox/lib/button'
import FontIcon from 'react-toolbox/lib/font_icon'
import Logo from '../../common/img/logo-vertical.png'
import SmallLogo from '../../common/img/logo-horizontal.png'

import styles from './styles.scss'
import CONFIG from '../../common/config.json'

const languages = Object.freeze(CONFIG.app.languages.available);
const messages = defineMessages({
    login: {
        id: 'login.title',
        description: 'Login card title',
        defaultMessage: 'Log In',
    },
    submit: {
        id: 'login.submit',
        description: 'Login submit button',
        defaultMessage: 'Submit',
    },
    user: {
        id: 'login.input.user',
        description: 'Login user input label',
        defaultMessage: 'User'
    },
    pass: {
        id: 'login.input.pass',
        description: 'Login password input label',
        defaultMessage: 'Password'
    },
    mandatory: {
        id: 'login.input.isMandatory',
        description : 'Message to show when a mandatory input is not fulfilled',
        defaultMessage: 'This input is mandatory'
    },
    loginError1: {
        id: 'login.error.1',
        description: 'Error message for wrong credentials. Line 1',
        defaultMessage: 'Wrong user credentials!'
    },
    loginError2: {
        id: 'login.error.2',
        description: 'Error message for wrong credentials. Line 2',
        defaultMessage: 'Try again'
    }
});

@CSSModules(styles)
@autobind class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.authenticate(props);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    state = {
        user: '',
        pass: '',
        showUserMandatory: false,
        showPassMandatory: false,
    };

    componentWillReceiveProps(nextProps) {
        this.authenticate(nextProps)
    }
    componentDidMount(){
        document.querySelector(`[data-lang=${this.props.language}]`).classList.add(styles['selected'])
    }
    componentDidUpdate(){
        document.querySelector(`.${styles['selected']}`).classList.remove(styles['selected']);
        document.querySelector(`[data-lang=${this.props.language}]`).classList.add(styles['selected'])
    }

    authenticate(props) {
        if (props.isAuthenticated) {
            this.context.router.history.push("app");
        }
    }

    handleLoginRequest(){
        const {login} = this.props;

        if(this.state.user.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showUserMandatory: true
                }
            });

        if(this.state.pass.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showPassMandatory: true
                }
            });

        if ( this.state.user.length !== 0 && this.state.pass.length !== 0 )
            login(this.state.user, this.state.pass)
    }

    handleUserInput( value ){
        const {setError, err} = this.props;

        this.setState((previousState) => {
            return {
                ...previousState,
                user: value,
                showUserMandatory: false
            }
        });

        if(err)
            setError(null)
    }
    handlePassInput( value ){
        const {setError, err} = this.props;

        this.setState((previousState) => {
            return {
                ...previousState,
                pass: value,
                showPassMandatory: false
            }
        });

        if(err)
            setError(null)
    }

    handleKeyPressed(evt){
        if(evt.which === 13)
            this.handleLoginRequest()
    }

    handleInputFocus(){
        const { setError, err } = this.props;

        if(err)
            setError(null)
    }

    setAppLanguage(lang){
        this.props.changeLanguage(lang)
    }

    render() {
        const {intl : {formatMessage}, err } = this.props;

        return (
            <div styleName = 'loginContainer'>
                <Navigation styleName = 'languageSelector' type='horizontal'>
                    { languages.map(({code, name}) => <Button flat
                                                              key = { code }
                                                              onClick = { () => this.setAppLanguage(code) }
                                                              tabIndex = { -1 }
                                                              data-lang = { code }> {name} </Button>) }
                </Navigation>
                <Card styleName='loginCard'>
                    <CardMedia styleName = 'logoContainer'>
                        <picture>
                            <source srcSet = { Logo } media = '(min-width: 960px)'/>
                            <img src = { SmallLogo } />
                        </picture>
                    </CardMedia>

                    <div styleName = 'loginForm' >
                        <div styleName = 'formContainer'>
                            <CardTitle title = {formatMessage(messages.login)} styleName = 'title' />
                            <hr styleName='divider'/>
                            <CardText styleName = 'inputs'>
                                <Input
                                    label = {formatMessage(messages.user)}
                                    hint = { this.state.user.length === 0 && formatMessage(messages.user) || ''}
                                    error = { this.state.showUserMandatory && formatMessage(messages.mandatory) || ''}
                                    onFocus = { this.handleInputFocus }
                                    onKeyPress = { this.handleKeyPressed }
                                    onChange = { this.handleUserInput }
                                    value = { this.state.user }
                                />
                                <Input
                                    type = 'password'
                                    label = {formatMessage(messages.pass)}
                                    hint = {this.state.pass.length === 0 && formatMessage(messages.pass) || ''}
                                    error = { this.state.showPassMandatory && formatMessage(messages.mandatory) || ''}
                                    onFocus = { this.handleInputFocus }
                                    onChange = {this.handlePassInput }
                                    onKeyPress = { this.handleKeyPressed }
                                    value = { this.state.pass }
                                />
                            </CardText>
                        </div>
                        {
                            !!err &&
                            <div styleName = 'error'>
                                <FontIcon value='error' styleName='icon' />
                                { (err.message.includes('401') || err.message.includes('403'))
                                    ?
                                    <div styleName = 'messages'>
                                        <span>{formatMessage(messages.loginError1)}</span>
                                        <span>{formatMessage(messages.loginError2)}</span>
                                    </div>
                                    :
                                    <span> Internal error: {err.message}</span>
                                }
                            </div>
                        }
                        <CardActions>
                            <Button
                                styleName = 'fullWidth'
                                label = {formatMessage(messages.submit)}
                                onClick = { this.handleLoginRequest }
                                raised
                                accent
                            />
                        </CardActions>
                    </div>
                </Card>

                <p styleName = 'copyright'>Made by Victor Jose Gallego Fontenla. <FontIcon>copyright</FontIcon> CiTIUS 2016.</p>
            </div>
        )
    }
}

export default injectIntl(Login)