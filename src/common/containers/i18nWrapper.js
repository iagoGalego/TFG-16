import PropTypes from 'prop-types';
import React, { Component } from 'react'
import { IntlProvider, addLocaleData } from 'react-intl'
import config from '../config.json'
import App from './App'

const languages = Object.freeze(config.app.languages.available);

//Cargamos os diferentes ficheiros de strings cos datos dos obxectos de definicion dos idiomas
let translations = {};
for(let { code } of languages){
    translations[code] = require(`../../translations/${code}.json`)
}
translations = Object.freeze(translations);

export default class I18nWrapper extends Component {
    constructor(props, context) {
        super(props, context);

        //Engadimos os datos de localizacion para cada un dos idiomas definidos anteriormente.
        for(let {code} of languages){
            addLocaleData(require(`react-intl/locale-data/${code}`))
        }

        try{ document.querySelector('html').setAttribute('lang', context.store.getState().UIState.language ) } catch (e) {}

        context.store.subscribe(() => {
            this.setState({language: context.store.getState().UIState.language});
            try{ document.querySelector('html').setAttribute('lang', this.state.language ) } catch (e) {}
        })
    }

    state = { language: this.context.store.getState().UIState.language };

    static contextTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        try{
            document.querySelector('html').setAttribute('lang', this.state.language)
        } catch (err) {
            Logger.instance.log('Error on setting the document language')
        }

        return (
                <IntlProvider ref = { this.state.language }
                              locale = { this.state.language }
                              messages = {translations[this.state.language]}>
                    <App {...this.props} />
                </IntlProvider>
            )
    }
}