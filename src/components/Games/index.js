import React, { Component } from 'react'
import GameEditorWrapper from '../../common/containers/GameEditorWrapper'
import { Switch } from 'react-router'
import { Route, Redirect } from "react-router-dom";
import GameList from '../../components/GameList'


export default class Games extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Switch>
                <Route exact path='/app/games' component = { GameList } />
                <Route exact path='/app/games/(.*)/editor' component = { GameEditorWrapper } />
                <Redirect from = '*' to='/app/404' />
            </Switch>
        )
    }
}

//{ createChild(children, this.props) }
