/**
 * Created by victorjose.gallego on 2/4/16.
 */
import TYPES from './types'

export function toggleDialog(){
    return {
        type: TYPES.TOGGLE_DIALOG
    }
}

export function saveTask( task ){
    return {
        type: TYPES.SAVE_TASK,
        payload: task,
    }
}