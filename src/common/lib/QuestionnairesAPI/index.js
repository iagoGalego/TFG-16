import CONFIG from '../../config.json'
import APIClient from "../API";

let __instance = null;

export class QuestionnairesAPIClient {
    constructor(){
        __instance = this;
        return __instance
    }

    static get instance(){
        return new QuestionnairesAPIClient()
    }

    saveQuestionnaire(questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
            body: JSON.stringify(questionnaire)
        }).then( response => {
            return response.ok
                ? response
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }



    updateQuestionnaire(questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires/${questionnaire.uri}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
            body: JSON.stringify(questionnaire)
        }).then( response => {
            return response.ok
                ? response
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    saveQuestion(question, questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questions?questionnaire=${questionnaire}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
            body: JSON.stringify(question)
        }).then( response => {
            return response.ok
                ? response
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    updateQuestion(question, questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questions/${question.uri}?questionnaire=${questionnaire}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
            body: JSON.stringify(question)
        }).then( response => {
            return response.ok
                ? response
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    deleteQuestion(uri, questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questions/${uri}?questionnaire=${questionnaire}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
        }).then( response => {
            return response.ok
                ? response
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    getAllQuestionnaires(){

        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
        }).then( response => {
            return response.ok
                ? response.json()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    getAllTags(){

        return fetch(`${CONFIG.questionnairesApi.baseURL}/tags`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
        }).then( response => {
            return response.ok
                ? response.json()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    getQuestionnaireByUri(uri){

        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires/${uri}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
        }).then( response => {
            return response.ok
                ? response.json()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    getQuestionnairesByName(name, tags){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires?name=${name}&tags=${tags}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
        }).then( response => {
            return response.ok
                ? response.json()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    getTagsByName(name){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/tags?name=${name}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
        }).then( response => {
            return response.ok
                ? response.json()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    deleteQuestionnaire(questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires/${questionnaire}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
        }).then( response => {
            return response.ok
                ? response
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }
}

export default QuestionnairesAPIClient
