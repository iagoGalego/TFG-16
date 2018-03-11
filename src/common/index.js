import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import Logger from './lib/Logger'
import CONFIG from './config.json'
import { configureStore } from './store/configure'
import Routes from './containers/Router'

const store = configureStore({});
let Router;

switch (CONFIG.app.historyType){
    case 'browserHistory':
        Router = BrowserRouter;
        break;
    case 'memoryHistory':
        throw Error('Not supported');
    default:
        Router = HashRouter;
        break;
}

try{
    document.querySelector('html').setAttribute('lang', store.getState().UIState.language)
} catch (err) {
    Logger.instance.log('Error on setting the document language')
}

render(
    <Provider store = { store }>
        <Router basename = {CONFIG.app.baseURL}>
            <Routes/>
        </Router>
    </Provider>,
    document.getElementById('app')
);