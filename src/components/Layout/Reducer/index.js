/**
 * Created by victorjose.gallego on 2/4/16.
 */

import CONFIG from '../../../common/config.json'
import TYPES from '../Actions/types'

const USER_CONFIG = JSON.parse(window.localStorage.getItem('config'));

const InitialState = {
    isMenuOpened: false,
    isSettingsPanelOpened : false,
    title: 'Default title',
    language: USER_CONFIG != null ? USER_CONFIG['lang'] : CONFIG.app.languages.default
};

export default function UIReducer(state = InitialState,  {type = '', payload = {}}  = {type:'', payload: {}}){
    switch (type){
        case TYPES.TOGGLE_MENU:
            return {
                ...state,
                isMenuOpened : !state.isMenuOpened
            };
        case TYPES.SET_TITLE:
            document.title = `${CONFIG.app.title} - ${payload.title}`
            
            return {
                ...state,
                title: payload.title
            };
        case TYPES.TOGGLE_SETTINGS:
            return {
                ...state,
                isSettingsPanelOpened: !state.isSettingsPanelOpened
            };
        case TYPES.SET_LANG:
            window.localStorage.setItem('config', JSON.stringify({...USER_CONFIG, lang: payload.lang}))
            return {
                ...state,
                language: payload.lang
            };
        default:
            return state
    }
}