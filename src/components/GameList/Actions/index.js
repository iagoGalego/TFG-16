/**
 * Created by victorjose.gallego on 2/4/16.
 */
import TYPES from './types'
import HMBAPI from '../../../common/lib/QuestionnairesAPI'
import HMBAPI2 from '../../../common/lib/API'

function requestAPICall(){
    return {
        type: TYPES.REQUEST
    }
}

function getGamesSuccess(games, pagesize) {
    return {
        type: TYPES.REQUEST_SUCCESS,
        payload: {
            games: games,
            pagesize: pagesize
        }
    }
}

function addGamesSuccess(games, pagesize) {
    return {
        type: TYPES.ADD_REQUEST_SUCCESS,
        payload: {
            games: games,
            pagesize: pagesize
        }
    }
}

function getTagsSuccess(tags) {
    return {
        type: TYPES.REQUEST_TAGS_SUCCESS,
        payload: {
            tags: tags,
        }
    }
}

function getDesignersSuccess(designers) {
    return {
        type: TYPES.REQUEST_DESIGNERS_SUCCESS,
        payload: {
            designers: designers,
        }
    }
}


function selectQuestionnairesSuccess(questionnaire) {
    return {
        type: TYPES.SET_SELECTED_QUESTIONNAIRE,
        payload: {
            questionnaire: questionnaire,
        }
    }
}

function selectQuestionnairesError(err) {
    return {
        type: TYPES.SELECTED_QUESTIONNAIRE_REQUEST_FAILURE,
        payload: {
            questionnaire: {},
            err
        }
    }
}

function getGamesError(err) {
    return {
        type: TYPES.REQUEST_FAILURE,
        payload: {
            games: [],
            err
        }
    }
}

function getDesignersError(err) {
    return {
        type: TYPES.REQUEST_DESIGNERS_FAILURE,
        payload: {
            designers: [],
            err
        }
    }
}

function getTagsError(err) {
    return {
        type: TYPES.REQUEST_TAGS_FAILURE,
        payload: {
            tags: [],
            err
        }
    }
}

export function setSelectedQuestionnaire(uri) {
    return dispatch => {
        dispatch(requestAPICall());
alert("byurisearch")
        return HMBAPI.instance
            .getQuestionnaireByUri(uri)
            .then( questionnaire => {
                dispatch(selectQuestionnairesSuccess(questionnaire))
            }).catch( err => dispatch(selectQuestionnairesError(err)) )
    }
}

export function saveQuestion(question, questionnaire) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .saveQuestion(question, questionnaire)
            .then( () => {
                HMBAPI.instance
                    .getQuestionnaireByUri(questionnaire)
                    .then( questionnaire => {
                        dispatch(selectQuestionnairesSuccess(questionnaire))
                    }).catch( err => dispatch(getQuestionnairesError(err)) )
            } )
    }
}

export function updateQuestion(question, questionnaire) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .updateQuestion(question, questionnaire)
            .then( () => {
                HMBAPI.instance
                    .getQuestionnaireByUri(questionnaire)
                    .then( questionnaire => {
                        dispatch(selectQuestionnairesSuccess(questionnaire))
                    }).catch( err => dispatch(getQuestionnairesError(err)) )
            } )
    }
}

export function saveQuestionnaire(questionnaire) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .saveQuestionnaire(questionnaire)
            .then( () => {
                HMBAPI.instance
                    .getAllQuestionnaires()
                    .then( questionnaires => {
                        dispatch(getQuestionnairesSuccess(questionnaires))
                    }).catch( err => dispatch(getQuestionnairesError(err)) )
            } )
    }
}

export function deleteQuestion(uri, questionnaire) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .deleteQuestion(uri, questionnaire)
            .then( () => {
                HMBAPI.instance
                    .getQuestionnaireByUri(questionnaire)
                    .then( questionnaire => {
                        dispatch(selectQuestionnairesSuccess(questionnaire))
                    }).catch( err => dispatch(getQuestionnairesError(err)) )
            } )

    }
}

export function updateQuestionnaire(questionnaire) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .updateQuestionnaire(questionnaire)
            .then( () => {
                HMBAPI.instance
                    .getQuestionnaireByUri(questionnaire.uri)
                    .then( questionnaire => {
                        dispatch(selectQuestionnairesSuccess(questionnaire))
                    }).catch( err => dispatch(getQuestionnairesError(err)) )
            } )

    }
}

export function getAllGames(page, pagesize) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI2.instance
            .DB.admin.workflows.getPaginatedWithoutQuery({ page: page, pagesize: pagesize } )
            .then( games => {
                dispatch(getGamesSuccess(games.content.result))
            }).catch( err => dispatch(getGamesError(err)) )
    }
}

export function getGamesByQuery(page, pagesize, designer, metadata, provider) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI2.instance
            .DB.admin.workflows.getPaginated({
                designer: designer, metadata: metadata,
                provider: provider, page: page, pagesize: pagesize
            })
            .then( games => {
                dispatch(getGamesSuccess(games.content.result, pagesize))
            }).catch( err => dispatch(getGamesError(err)) )
    }
}

export function addGamesByQuery(page, pagesize, designer, metadata, provider) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI2.instance
            .DB.admin.workflows.getPaginated({
                designer: designer, metadata: metadata,
                provider: provider, page: page, pagesize: pagesize
            })
            .then( games => {
                dispatch(addGamesSuccess(games.content.result, pagesize))
            }).catch( err => dispatch(getGamesError(err)) )
    }
}

export function getAllDesigners() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI2.instance
            .DB.admin.users.getAll()
            .then( users => {
                dispatch(getDesignersSuccess(users.content))
            }).catch( err => dispatch(getDesignersError(err)) )
    }
}

export function getQuestionnairesByName(name, tags) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .getQuestionnairesByName(name, tags)
            .then( questionnaires => {
                dispatch(getQuestionnairesSuccess(questionnaires))
            }).catch( err => dispatch(getQuestionnairesError(err)) )
    }
}

export function getQuestionnairesByNameOrTag(value) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .getQuestionnairesByNameOrTag(value)
            .then( questionnaires => {
                dispatch(getQuestionnairesSuccess(questionnaires))
            }).catch( err => dispatch(getQuestionnairesError(err)) )
    }
}

export function getTagsByName(name) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .getTagsByName(name)
            .then( tags => {
                dispatch(getTagsSuccess(tags))
            }).catch( err => dispatch(getTagsError(err)) )
    }
}

export function deleteGame(game) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI2.instance
            .DB.admin.workflows.delete(game)
            .then( () => {
                HMBAPI2.instance
                    .DB.admin.workflows.getPaginatedWithoutQuery({page: 0, pagesize: 50})
                    .then( games => {
                        dispatch(getGamesSuccess(games.content.result))
                    }).catch( err => dispatch(getGamesError(err)) )
            } )

    }
}