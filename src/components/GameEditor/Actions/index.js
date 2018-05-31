/**
 * Created by victorjose.gallego on 2/4/16.
 */
import TYPES from './types'
import HMBAPI from "../../../common/lib/API";
import {LEVELS, Logger} from "../../../common/lib/Logger";

export function addTaskInLink({task, link}){
    return [
        {
            type: TYPES.ADD_TASK_IN_LINK,
            payload: { task, link },
        }, {
            type: TYPES.SET_CLEAN,
            payload: { clean: false }
        }, {
            type: TYPES.SET_SELECTED_TASK,
            payload: { task },
        }
    ]
}

export function clearDiagram(){
    return [{
        type: TYPES.CLEAR_DIAGRAM
    }, {
        type: TYPES.SET_CLEAN,
        payload: { clean: true }
    }]
}

export function deleteTask(task){
    return [
        {
            type: TYPES.DELETE_TASK,
            payload: { task }
        },{
            type: TYPES.SET_SELECTED_TASK,
            payload: { task: null },
        }
    ]
}

export function setSelectedTask(task){
    return {
        type: TYPES.SET_SELECTED_TASK,
        payload: { task },
    }
}

export function moveTask(task) {
    return {
        type: TYPES.MOVE_TASK,
        payload: {task}
    }
}

export function saveTask(task){
    return [
        {
            type: TYPES.SAVE_TASK,
            payload: { task },
        },{
            type: TYPES.SET_SELECTED_TASK,
            payload: { task: null },
        }
    ]
}

export function saveEdge(task){
    return [
        {
            type: TYPES.SAVE_EDGE,
            payload: { task },
        }, {
            type: TYPES.SET_SELECTED_TASK,
            payload: { task: null },
        }
    ]
}

export function undo(){
    return [{
        type: TYPES.UNDO
    }, {
        type: TYPES.SET_SELECTED_TASK,
        payload: { task: null },
    }]
}

export function redo(){
    return [{
        type: TYPES.REDO
    }, {
        type: TYPES.SET_SELECTED_TASK,
        payload: { task: null },
    }]
}

function requestAPICall(){
    return {
        type: TYPES.REQUEST
    }
}

function requestAPIError(err) {
    if(!err.message.includes('401'))
        Logger.instance.log(LEVELS.ERROR, 'Error on API request', err);

    return {
        type: TYPES.REQUEST_FAILURE,
        payload : {
            err
        }
    }
}

function saveWorkFlowSuccess() {
    return {
        type: TYPES.REQUEST_SUCCESS,
        payload: {}
    }
}

export function save(workflow){
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .DB.admin.workflows.create(workflow)
            .then( () => dispatch(saveWorkFlowSuccess()))
            .catch( err => dispatch(requestAPIError(err)) )
    }
}

export function edit(workflow){
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .DB.admin.workflows.delete(workflow.uri)
            .then( () => {
                return HMBAPI.instance
                    .DB.admin.workflows.create(workflow)
                    .then( () => dispatch(saveWorkFlowSuccess()))
                    .catch( err => dispatch(requestAPIError(err)) )
            })
    }
}

function selectWorkflowSuccess(workflow) {
    return [{
        type: TYPES.SET_SELECTED_WORKFLOW,
        payload: {
            workflow: workflow,
        }},{
        type: TYPES.CLEAR_HISTORY
    }
    ]
}

function selectWorkflowError(err) {
    return {
        type: TYPES.SELECTED_WORKFLOW_REQUEST_FAILURE,
        payload: {
            workflow: {},
            err
        }
    }
}

function getRolesSuccess(roles) {
    return {
        type: TYPES.SET_ROLES,
        payload: {
            roles: roles,
        }
    }
}

function getRolesError(err) {
    return {
        type: TYPES.SET_ROLES_FAILURE,
        payload: {
            roles: [],
            err
        }
    }
}

function getOperatorsSuccess(operators) {
    return {
        type: TYPES.SET_OPERATORS,
        payload: {
            operators: operators,
        }
    }
}

function getOperatorsError(err) {
    return {
        type: TYPES.SET_OPERATORS_FAILURE,
        payload: {
            operators: [],
            err
        }
    }
}

function getPropertiesSuccess(properties) {
    return {
        type: TYPES.SET_PROPERTIES,
        payload: {
            properties: properties,
        }
    }
}

function getPropertiesError(err) {
    return {
        type: TYPES.SET_PROPERTIES_FAILURE,
        payload: {
            properties: [],
            err
        }
    }
}

export function setSelectedWorkflow(uri) {
    if(uri === null){
        return dispatch => {
            dispatch(requestAPICall());

            return dispatch(selectWorkflowSuccess(null))
        }
    } else {
        return dispatch => {
            dispatch(requestAPICall());

            return HMBAPI.instance
                .DB.admin.workflows.get(uri)
                .then( workflow => {
                    dispatch(selectWorkflowSuccess(workflow.content))
                }).catch( err => dispatch(selectWorkflowError(err)) )
        }
    }

}

export function getRoles() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .DB.admin.tags.getAll()
            .then( roles => {
                dispatch(getRolesSuccess(roles.content))
            }).catch( err => dispatch(getRolesError(err)) )
    }
}

export function getOperators() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .DB.admin.operators.getAll()
            .then( operators => {
                dispatch(getOperatorsSuccess(operators.content))
            }).catch( err => dispatch(getOperatorsError(err)) )
    }
}

export function getAllProperties() {
    return dispatch => {
        dispatch(requestAPICall());

        return HMBAPI.instance
            .DB.admin.globalResourceProperties.getAllWithourProvider()
            .then( properties => {
                dispatch(getPropertiesSuccess(properties.content))
            }).catch( err => dispatch(getPropertiesError(err)) )
    }
}