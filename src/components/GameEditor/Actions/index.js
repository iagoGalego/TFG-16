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
                HMBAPI.instance
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