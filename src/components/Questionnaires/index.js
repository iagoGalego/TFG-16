import React, { Component } from 'react'
import { Switch } from 'react-router'
import { Route, Redirect} from "react-router-dom";
import QuestionnairesList from '../../components/QuestionnairesList'
import QuestionnairesEditor from '../../components/QuestionnairesEditor'


export default class Questionnaires extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Switch>
                <Route exact path='/app/questionnaires' component = { QuestionnairesList } />
                <Route exact path='/app/questionnaires/(.*)/edit' component = { QuestionnairesEditor } />
                <Redirect from = '*' to='/app/404' />
            </Switch>
        )
    }
}