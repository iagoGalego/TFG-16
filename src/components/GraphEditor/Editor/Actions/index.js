import TYPES from './types'

export function saveTask(  ){
    return {
        type: TYPES.SAVE_TASK,
        payload: task,
    }
}