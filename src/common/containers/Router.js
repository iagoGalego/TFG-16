import I18nWrapper from './i18nWrapper'
import LoginWrapper from './LoginWrapper'
import LayoutWrapper from './LayoutWrapper'
import GameEditorWrapper from './GameEditorWrapper'
import React, {Component} from 'react'
import { Switch } from 'react-router'
import { Route, Redirect} from "react-router-dom";

import About from '../../components/About'
import Home from '../../components/Home'
import NotFound from '../../components/NotFound'
import Games from '../../components/Games'
import GameList from '../../components/GameList'

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

/*export default class Routes extends Component{
    render(){
        return <Switch>
                <Route path='/login' component = { One } />
                <Route path='/test' component = {Two} />
                <Route exact path='/' component = { () => <Redirect to='/login'/> }/>
            </Switch>
    }
}*/

/*
<Route exact path = '/' render = { () => <Redirect to = '/login' component = { LoginWrapper }/> } />
        <Switch>
            <Route  path = '/' component = { LoginWrapper } />
            <Redirect path = '*' to = '/'/>
        </Switch>
 */
/*
    <Route path = '/' component = { i18nWrapper }>
        <IndexRedirect to = 'login'  />
        <Route path = 'login' component = { LoginWrapper } />
        <Route path = 'app' component = { LayoutWrapper } >
            <IndexRedirect to = 'dashboard' />
            <Route path = 'dashboard' component = { Home } />
            <Route path = 'games' component = { Games }>
                <IndexRoute component={GameList}/>
                <Route path = 'editor' component = { GameEditorWrapper } />
            </Route>
            <Route path = 'about' component = { About } />
            <Route path = '404' component = { NotFound } />
            <Redirect from='*' to='404' />
        </Route>
    </Route>
 */