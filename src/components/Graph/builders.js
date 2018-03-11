/**
 * Created by victorjose.gallego on 6/6/16.
 */
import JointHTML from './JointJSHTMLElement'
import HMBElements from './HMBElements'
import { TASK_TYPE } from '../../common/lib/model/builders';

class JointHTMLElementBuilder{
    constructor(){
        this.inPorts = []
        this.outPorts = []
        this.setTagReference([])
        this.setPosition(0,0)
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
    setInitial( initial = true ){
        this.isInitial = initial
        return this
    }
    setFinal( final = true ){
        this.isFinal = final
        return this
    }
    setOperator( operator ){
        this.operator = operator
        return this
    }
    setRequired( required = true ){
        this.isRequired = required
        return this
    }
    setTagReference( tagReference ){
        this.tagReference = tagReference
        return this
    }
    addTagReference( tagReference ){
        this.tagReference.push(tagReference)
        return this
    }
    setRelativeStartTime( timeMillis ){
        this.startDate = timeMillis
        this.startDateIsRelative = true
        return this
    }
    setAbsoluteStartTime( timeMillis ){
        this.startDate = timeMillis
        this.startDateIsRelative = false
        return this
    }
    setRelativeExpiryTime( timeMillis ){
        this.expiryDate = timeMillis
        this.expiryDateIsRelative = true
        return this
    }
    setAbsoluteExpiryTime( timeMillis ){
        this.expiryDate = timeMillis
        this.expiryDateIsRelative = false
        return this
    }

    //TODO set parameter value
    /*
        setOperatorIntegerParameter( parameterName, parameterValue ){}
        setOperatorFloatParameter( parameterName, parameterValue ){}
        setOperatorStringParameter( parameterName, parameterValue ){}
        setOperatorBooleanParameter( parameterName, parameterValue ){}
        setOperatorDateParameter( parameterName, parameterValue ){}
        setOperatorSortParameter( parameterName, parameterValue ){}
    */

    addInPort(){
        this.inPorts.push(`${this.inPorts.length}-${Date.now()-Math.random()}`)
        return this
    }
    addInPorts(n){
        for(let i=0; i<n; i++) this.addInPort()
        return this
    }
    addOutPort(){
        this.outPorts.push(`${this.outPorts.length}-${Date.now()-Math.random()}`)
        return this
    }
    addOutPorts(n){
        for(let i=0; i<n; i++) this.addOutPort()
        return this
    }
    addToGraph(graph){
        this.build().addTo(graph)
        return this
    }
    build(){
        if (!this.__element)
            this.__element = new JointHTML.Element({
                size: { width: 170, height: 100 },
                attrs: {
                    rect: { fill: '#FFFFFF' },
                    '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
                    '.outPorts circle': { fill: '#E74C3C', type: 'output' }
                },
                template: `${this.name}`,
                ...this
            }).position(this.__x, this.__y)

        return this.__element
    }
}

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