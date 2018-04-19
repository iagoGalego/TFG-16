import I18nWrapper from './i18nWrapper'
import LoginWrapper from './LoginWrapper'
import LayoutWrapper from './LayoutWrapper'
import React, {Component} from 'react'
import { Switch } from 'react-router'
import { Route, Redirect} from "react-router-dom";

export default class Routes extends Component {
    render(){
        return (
            //Add routes here. ATTENTION: the 404 redirect should be the last defined route
            <I18nWrapper>
                <Switch>
                    <Route path='/login' component = { LoginWrapper } />
                    <Route path = '/app' component = { LayoutWrapper } />
                    <Route exact path='/' component = {() => <Redirect to='/login'/>}/>
                </Switch>
            </I18nWrapper>
        )
    }
}