import React, { Component } from 'react'
import GameEditorWrapper from '../../common/containers/GameEditorWrapper'
import { Switch } from 'react-router'
import { Route } from "react-router-dom";
import QuestionnairesList from '../../components/QuestionnairesList'


export default class Questionnaires extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Switch>
                <Route exact path='/app/questionnaires' component = { QuestionnairesList } />
                <Route path = '/app/games/editor' component = { GameEditorWrapper } />
            </Switch>
        )
    }
}