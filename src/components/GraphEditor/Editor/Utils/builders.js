import HMBElements from './../HMBElements'
import { TASK_TYPE } from '../../../../common/lib/model/builders';

export class TaskBuilder{
    constructor(taskType){
        this.TASK_TYPE = taskType
    }

    setName( name ){
        this.name = name
        return this
    }
    setDescription( description ){
        this.description = description
        return this
    }
    setPosition( x, y ){
        this.__x = x
        this.__y = y
        return this
    }

    addToGraph(graph){
        this.build().addTo(graph)
        return this
    }

    build(){
        switch(this.TASK_TYPE){
            case TASK_TYPE.AND_SPLIT:
                return new HMBElements.AndSplit()
            case TASK_TYPE.AUTOMATIC_CHOICE:
                return new HMBElements.AutomaticChoice()
            case TASK_TYPE.AUTOMATIC_TASK:
                return new HMBElements.AutomaticTask()
            case TASK_TYPE.INITIAL_TASK:
                return new HMBElements.InitialTask()
            case TASK_TYPE.LAST_TASK:
                return new HMBElements.LastTask()
            case TASK_TYPE.USER_TASK:
                return new HMBElements.UserTask()
            case TASK_TYPE.USER_CHOICE:
                return new HMBElements.UserChoice()
        }
    }
}