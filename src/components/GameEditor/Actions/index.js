/**
 * Created by victorjose.gallego on 2/4/16.
 */
import TYPES from './types'

export function addTaskInLink({task, link}){
    return [
        {
            type: TYPES.ADD_TASK_IN_LINK,
            payload: { task, link },
        }, {
            type: TYPES.SET_SELECTED_TASK,
            payload: { task },
        }
    ]
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

export function saveTask(task){
    return [
        {
            type: TYPES.SAVE_TASK,
            payload: { task },
        },{
            type: TYPES.SET_SELECTED_TASK,
            payload: { task },
        }
    ]
}

export function undo(){
    return {
        type: TYPES.UNDO
    }
}

export function redo(){
    return {
        type: TYPES.REDO
    }
}