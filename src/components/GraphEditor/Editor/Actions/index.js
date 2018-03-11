/**
 * Created by victorjose.gallego on 2/4/16.
 */
import TYPES from './types'

export function saveTask(  ){
    return {
        type: TYPES.SAVE_TASK,
        payload: task,
    }
}