/* This file merely configures the store for hot reloading.
 * This boilerplate file is likely to be the same for each project that uses Redux.
 * With Redux, the actual stores are in ./reducers.
 */

import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { batchedSubscribe } from 'redux-batched-subscribe'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import allReducers from './reducers'

export function configureStore(initialState) {
    const reducers = combineReducers({
        ...allReducers,
        routing: routerReducer
    })

    const store = createStore(
        reducers,
        initialState,
        compose(
            applyMiddleware(thunk, multi),
            window.devToolsExtension ? window.devToolsExtension() : f => f,
            batchedSubscribe(batchedUpdates),
        )
    )

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextReducer = require('./reducers/index')
            store.replaceReducer(nextReducer)
        });
    }

    return store;
}