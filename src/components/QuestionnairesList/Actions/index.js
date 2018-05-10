/**
 * Created by victorjose.gallego on 2/4/16.
 */
import TYPES from './types'
import HMBAPI from '../../../common/lib/QuestionnairesAPI'

function requestAPICall(){
    return {
        type: TYPES.REQUEST
    }
}

function getQuestionnairesSuccess(questionnaires) {
    return {
        type: TYPES.REQUEST_SUCCESS,
        payload: {
            questionnaires: questionnaires,
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

function getQuestionnairesError(err) {
    return {
        type: TYPES.REQUEST_FAILURE,
        payload: {
            questionnaires: [],
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

export function getAllQuestionnaires() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .getAllQuestionnaires()
            .then( questionnaires => {
                dispatch(getQuestionnairesSuccess(questionnaires))
            }).catch( err => dispatch(getQuestionnairesError(err)) )
    }
}

export function getAllTags() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .getAllTags()
            .then( tags => {
                dispatch(getTagsSuccess(tags))
            }).catch( err => dispatch(getTagsError(err)) )
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

export function deleteQuestionnaire(questionnaire) {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .deleteQuestionnaire(questionnaire)
            .then( () => {
                HMBAPI.instance
                    .getAllQuestionnaires()
                    .then( questionnaires => {
                        dispatch(getQuestionnairesSuccess(questionnaires))
                    }).catch( err => dispatch(getQuestionnairesError(err)) )
            } )

    }
}