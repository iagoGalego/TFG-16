import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import styles from './styles.scss'

import image from './img/404.svg'

@CSSModules(styles)
class NotFound extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div styleName='error'>
                <img src={ image } />
                <hgroup>
                    <h1>
                        <FormattedMessage
                            id = 'error.not-found.main'
                            description = 'Error page main message'
                            defaultMessage = 'Sorry, but you are wrong!'
                            />
                    </h1>
                    <h2>
                        <FormattedMessage
                            id = 'error.not-found.doesnt-exists'
                            description = 'Error page message 2'
                            defaultMessage = {'The page you have requested doesn\'t exist...'}
                            />
                    </h2>
                    <h3>
                        <FormattedMessage
                            id = 'error.not-found.not-implemented'
                            description = 'Error page message 3'
                            defaultMessage = '(Or may be not yet implemented)'
                            />
                    </h3>
                </hgroup>
            </div>
        )
    }
}

export default NotFound
