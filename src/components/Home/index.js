import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { defineMessages, injectIntl} from 'react-intl'
import { connect } from 'react-redux';
import styles from './styles.scss'
import { bindActionCreators } from 'redux'
import {setTitle} from "../Layout/Actions";

const messages = defineMessages({
    title : {
        id : 'home.title',
        description : 'Home page title',
        defaultMessage : 'Home'
    }
});

@connect(() => {return {}}, (dispatch) => {return {setAppTitle: bindActionCreators(setTitle, dispatch)}})
@CSSModules(styles)
class Home extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount(){
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title))
    }

    render() {
        return(
            <div styleName = 'home'>
                <img src='http://www.phdcomics.com/comics/archive/phd091916s.gif' />
                <hgroup>
                    <h1>Welcome!</h1>
                    <h4>This is a React+Redux+ReactRouter app template</h4>
                </hgroup>
                <span><b>Created by </b><i><a href='mailto:victorj.gallego+react.template@gmail.com'>Víctor José Gallego Fontenla</a></i></span>
            </div>
        )
    }
}

export default injectIntl(Home)