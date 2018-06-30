import CONFIG from '../../config.json'
import URLSearchParams from "url-search-params";

let __instance = null;
let __token = null;
let __user = null;

export class QuestionnairesAPIClient {
    constructor(){
        if(!__instance){
            __instance = this;
        }

        return __instance
    }

    static get instance(){
        return new QuestionnairesAPIClient()
    }

    static init(token, user){
        if(token && !__token)
            __token = token
        if(user && !__user)
            __user = user
    }

    login(user){
        if(user.user === undefined || user.pass === undefined){
            let err =  new Error('The user and password are mandatory');

            return Promise.reject(err)
        }

        return fetch(`${CONFIG.questionnairesApi.baseURL}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
            },
            mode: 'cors',
            body: JSON.stringify(user)
        }).then( response => {
            return response.ok
                ? response.text()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        }).then( token => {
            __user = user.uri;
            __token = token;
            return token
        })
    }
    logout(){
        if(!__token){
            let err = new Error('You must log in first!');

            return Promise.reject(err)
        }

        let query = new URLSearchParams();
        query.append('token', __token);

        return fetch(`${CONFIG.questionnairesApi.baseURL}/logout?${query.toString()}`).then( response => {
            return response.ok
                ? response
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        }).then( json => {
            __token = null;
            return json
        })
    }
    loadUserConfiguration(user){
        if(user === undefined){
            let err =  new Error('The user is mandatory');

            return Promise.reject(err)
        }

        //TODO fetch config
        return {
            lang: 'en'
        }
    }

    saveQuestionnaire(questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires`, {
            method: 'POST',
            headers: {
                'X-Auth-Token' : __token,
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
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires/${questionnaire.uri}?user=${__user}`, {
            method: 'PUT',
            headers: {
                'X-Auth-Token' : __token,
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

    saveQuestion(data, questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questions?questionnaire=${questionnaire}`, {
            method: 'POST',
            headers: {
                'X-Auth-Token' : __token,
                'Accept': 'application/json;charset=utf-8',
                'processData': false,
            },
            mode: 'cors',
            body: data
        }).then( response => {
            return response.ok
                ? response
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }

    updateQuestion(data, question, questionnaire){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questions/${question}?questionnaire=${questionnaire}`, {
            method: 'PUT',
            headers: {
                'X-Auth-Token' : __token,
                'Accept': 'application/json;charset=utf-8',
                'processData': false,
            },
            mode: 'cors',
            body: data
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
                'X-Auth-Token' : __token,
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

        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires?user=${__user}`, {
            method: 'GET',
            headers: {
                'X-Auth-Token' : __token,
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
                'X-Auth-Token' : __token,
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

        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires/${uri}?user=${__user}`, {
            method: 'GET',
            headers: {
                'X-Auth-Token' : __token,
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
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires?name=${name}&tags=${tags}&user=${__user}`, {
            method: 'GET',
            headers: {
                'X-Auth-Token' : __token,
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

    getQuestionnairesByNameOrTag(value){
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires?value=${value}&user=${__user}`, {
            method: 'GET',
            headers: {
                'X-Auth-Token' : __token,
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
                'X-Auth-Token' : __token,
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
        return fetch(`${CONFIG.questionnairesApi.baseURL}/questionnaires/${questionnaire}?user=${__user}`, {
            method: 'DELETE',
            headers: {
                'X-Auth-Token' : __token,
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
