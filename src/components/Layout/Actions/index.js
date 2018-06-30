import UI_ACTION_TYPES from './types'

export function toggleMenu(){
    return {type: UI_ACTION_TYPES.TOGGLE_MENU}
}

export function toggleSettingsPanel(){
    return {type: UI_ACTION_TYPES.TOGGLE_SETTINGS}
}

export function setTitle(title){
    return {type: UI_ACTION_TYPES.SET_TITLE, payload: { title }}
}

export function setAppLanguage(lang){
    return { type: UI_ACTION_TYPES.SET_LANG, payload: { lang }}
}

