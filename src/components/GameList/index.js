import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { defineMessages, injectIntl } from 'react-intl'

import styles from './styles.scss'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setTitle} from "../Layout/Actions";

const messages = defineMessages({
    title : {
        id : 'games.title',
        description : 'Games page title',
        defaultMessage : 'Games'
    }
});

@connect(() => {return {}}, (dispatch) => {return {setAppTitle: bindActionCreators(setTitle, dispatch)}})
@CSSModules(styles)
class GameList extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount(){
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title))
    }

    render() {
        return (
            <div>
                <h1>Lista de juegos</h1>
                <a href='/app/games/editor'>Acceder al editor</a>
            </div>
        )
    }
}

export default injectIntl(GameList)