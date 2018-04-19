/**
 * Created by victorjose.gallego on 6/3/16.
 */
import {
    Task,
    AutomaticTask,
    AutomaticChoice,
    UserChoice,
    OrJoin,
    Split,
    AndJoin,
    ChoicePathCondition,
    ConditionDate,
    SequenceFlow,
    Workflow,
    ParameterValue,
    IntegerType,
    FloatType,
    BooleanType,
    StringType,
    DateType,
    HumanTask,
} from './index';

export const TASK_TYPE = Object.freeze({
    USER_TASK : Symbol('USER_TASK'),
    AUTOMATIC_TASK : Symbol('AUTOMATIC_TASK'),
    AUTOMATIC_CHOICE: Symbol('AUTOMATIC_CHOICE_TASK'),
    USER_CHOICE: Symbol('USER_CHOICE_TASK'),
    AND_SPLIT: Symbol('AND_SPLIT_TASK'),
    INITIAL_TASK: Symbol('INTIAL_TASK'),
    LAST_TASK: Symbol('LAST_TASK'),
    USER_CHOICE_END: Symbol('USER_CHOICE_END'),
    AUTOMATIC_CHOICE_END: Symbol('AUTOMATIC_CHOICE_END'),
    AND_SPLIT_END: Symbol('AND_SPLIT_END'),
    LOOP: Symbol('LOOP'),
    LOOP_END: Symbol('LOOP_END')
});

export class TaskBuilder{
    constructor(val = true, uri){
        if(val === true)this.__task = new HumanTask(uri);
        else this.__task = new AutomaticTask(uri);
        this.__task.genURI();
        this.setInitial(false);
        this.setFinal(false);
        this.setRequired(false);
        this.setTagReference()
    }
    setInitial( val = true ){
        this.__task.isInitial = val;
        return this
    }
    setFinal( val = true ){
        this.__task.isFinal = val;
        return this
    }
    isDisabled(isDisabled){
        this.__task.isDisabled = isDisabled;
        return this
    }
    setMetadata( metadata = [] ){
        this.__task.metadata = metadata;
        return this
    }
    setUser( user = [] ){
        this.__task.user = user;
        return this
    }
    setWorkflow( workflow ){
        this.__task.workflow = workflow;
        return this
    }
    setLastVersionNumber(lastVersionNumber){
        this.__task.lastVersionNumber = lastVersionNumber;
        return this
    }
    setVersionNumber(versionNumber){
        this.__task.versionNumber = versionNumber;
        return this
    }
    setOperator( operator ) {
        //UNCOMMENT if (!operator) throw new ReferenceError("Operator is undefined")
        this.__task.operator = operator;
        return this
    }
    setName( name ){
        this.__task.name = name;
        return this
    }
    setNumberOfPaths( numberOfPaths ){
        this.__task.numberOfPaths = numberOfPaths;
    }
    setDescription( description ){
        this.__task.description = description;
        return this
    }
    setRequired( required = true ){
        this.__task.isRequired = required;
        return this
    }
    addTagReference( tag ){
        this.__task.tagReference.push(tag);
        return this
    }
    setTagReference( tags = [] ){
        this.__task.tagReference = tags;
        return this
    }
    setStartDate( date ){
        this.__task.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__task.expiryDate = date;
        return this
    }
    setRelativeStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI()
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setAbsoluteStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setRelativeExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    setAbsoluteExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    setParameters( parameters = [] ){
        this.__task.parameterValue = parameters;
        return this
    }
    setOperatorIntegerParameter( parameterName, parameterValue ){
        if (!this.__task.operator) throw new ReferenceError("Task without operator. Set operator first.")
        let p = ParameterValueBuilder()
                    .setParameterFromOperator(this.__task.operator, parameterName)
                    .setParameterIntegerValue(parameterValue)
                    .build();
        this.__task.parameterValue.push(p);
        return this
    }
    setOperatorFloatParameter( parameterName, parameterValue ){
        if (!this.__task.operator) throw new ReferenceError("Task without operator. Set operator first.")
        let p = ParameterValueBuilder()
            .setParameterFromOperator(this.__task.operator, parameterName)
            .setParameterFloatValue(parameterValue)
            .build()
        this.__task.parameterValue.push(p);
        return this
    }
    setOperatorStringParameter( parameterName, parameterValue ){
        if (!this.__task.operator) throw new ReferenceError("Task without operator. Set operator first.")
        let p = ParameterValueBuilder()
            .setParameterFromOperator(this.__task.operator, parameterName)
            .setParameterStringValue(parameterValue)
            .build();
        this.__task.parameterValue.push(p);
        return this
    }
    setOperatorBooleanParameter( parameterName, parameterValue ){
        if (!this.__task.operator) throw new ReferenceError("Task without operator. Set operator first.");
        let p = ParameterValueBuilder()
            .setParameterFromOperator(this.__task.operator, parameterName)
            .setParameterBooleanValue(parameterValue)
            .build();
        this.__task.parameterValue.push(p);
        return this
    }
    setOperatorDateParameter( parameterName, parameterValue ){
        if (!this.__task.operator) throw new ReferenceError("Task without operator. Set operator first.");
        let p = ParameterValueBuilder()
            .setParameterFromOperator(this.__task.operator, parameterName)
            .setParameterDateValue(parameterValue)
            .build();
        this.__task.parameterValue.push(p);
        return this
    }
    setOperatorSortParameter( parameterName, parameterValue ){
        if (!this.__task.operator) throw new ReferenceError("Task without operator. Set operator first.");
        let p = ParameterValueBuilder()
            .setParameterFromOperator(this.__task.operator, parameterName)
            .setParameterSortValue(parameterValue)
            .build();
        this.__task.parameterValue.push(p);
        return this
    }
    addToArray( array ){
        array.push(this.build());
        return this
    }
    build(){
        return this.__task
    }
}
export class SequenceFlowBuilder{
    constructor(){
        this.__sf = new SequenceFlow();
        this.__sf.genURI()
    }
    from( taskid, index ){
        if ( !taskid || index < 0 ) throw new Error("SequenceFlow construction error");

        this.__sf.sourceTask = taskid instanceof Task ? taskid.uri : taskid;
        this.__sf.sourceIndex = index;

        return this
    }
    to( taskid, index ){
        if ( !taskid || index < 0 ) throw new Error("SequenceFlow construction error");

        this.__sf.targetTask = taskid instanceof Task ? taskid.uri : taskid;
        this.__sf.targetIndex = index;

        return this
    }
    lastVersionNumber(lastVersionNumber){
        this.__sf.lastVersionNumber = lastVersionNumber;
        return this
    }
    versionNumber(versionNumber){
        this.__sf.versionNumber = versionNumber;
        return this
    }
    isDisabled(isDisabled = false){
        this.__sf.isDisabled = isDisabled;
        return this
    }
    addToArray( array ){
        array.push(this.build());
        return this
    }
    build(){
        return this.__sf
    }
}
export class WorkflowBuilder{
    constructor(){
        this.__wf = new Workflow();
        this.__wf.genURI();
        this.setFusions();
        this.setTasks();
        this.setIsSubWorkflow(false);
        this.setMetadata()
    }
    setName( name ){
        this.__wf.name = name;
        return this
    }
    setModificationDate(modificationDate){
        this.__wf.modificationDate = modificationDate;
        return this
    }
    setTrigger(trigger){
        this.__wf.trigger = trigger;
        return this
    }
    setVersionNumber(versionNumber){
        this.__wf.versionNumber = versionNumber;
        return this
    }
    setExecutionId(executionId){
        this.__wf.executionId = executionId;
        return this
    }
    setExecutionStatus(executionStatus){
        this.__wf.executionStatus = executionStatus;
        return this
    }
    setDescription( desc ){
        this.__wf.description = desc;
        return this
    }
    setDesigner( designer ){
        this.__wf.designer = designer;
        return this
    }
    setTasks( tasks = [] ){
        this.__wf.element = tasks;
        return this
    }
    addTask( task ){
        this.__wf.element.push(task);
        return this
    }
    setFusions( fusions = [] ){
        this.__wf.sequenceFlow = fusions;
        return this
    }
    addFusion( fusion ){
        this.__wf.sequenceFlow.push(fusion);
        return this
    }
    setIsValidated( validated = true ){
        this.__wf.isValidated = validated;
        return this
    }
    setIsDesignFinished( designFinished = true ){
        this.__wf.isDesignFinished = designFinished;
        return this
    }
    setProvider( provider ){
        this.__wf.provider = provider;
        return this
    }
    setIsSubWorkflow( boolean = true ){
        this.__wf.isSubWorkflow = boolean;
        return this
    }
    setMetadata( metadata = [] ){
        this.__wf.metadata = metadata;
        return this
    }
    addMetadata( metadata){
        this.__wf.metadata.push(metadata);
        return this
    }
    setStartDate( date ){
        this.__wf.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__wf.expiryDate = date;
        return this
    }
    setRelativeStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setAbsoluteStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setRelativeExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    setAbsoluteExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    build(){
        return this.__wf
    }
}
export class AutomaticChoiceBuilder{
    constructor(uri){
        this.__split = new AutomaticChoice(uri);
        this.__split.genURI();
        this.__split.isInitial = false;
        this.__split.isFinal = false;
        this.__split.isRequired = true;
        this.__split.isDisabled = false;
        this.__split.pathCondition = [];
    }
    setPairedTask( pairedTask ){
        this.__split.pairedTask = pairedTask;
        return this
    }
    setNumberOfPaths( numberOfPaths ){
        this.__split.numberOfPaths = numberOfPaths;
        return this
    }
    setPathCondition( pathIndex, condition ){
        let cpc = new ChoicePathCondition();
        cpc.genURI();
        cpc.pathIndex = pathIndex;
        cpc.condition = condition;
        this.__split.pathCondition.push(cpc);
        return this
    }
    setNullPathCondition( pathIndex ){
        let cpc = new ChoicePathCondition();
        cpc.genURI();
        cpc.pathIndex = pathIndex;
        cpc.condition = null;
        this.__split.pathCondition.push(cpc);
        return this
    }
    setName( name ){
        this.__split.name = `${name} (Split)`;
        return this
    }
    setDescription( description ){
        this.__split.description = description;
        return this
    }
    setRequired( required = true ){
        this.__split.isRequired = required;
        return this
    }
    setStartDate( date ){
        this.__split.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__split.expiryDate = date;
        return this
    }
    setRelativeStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setAbsoluteStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setRelativeExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    setAbsoluteExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI()
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    addToArray( array ){
        array.push(this.build().split);
        return this
    }
    build(){
        //if ( this.__split.numberOfPaths !== this.__split.pathCondition.length ) throw new Error("Number of paths != number of set path conditions")
        return this.__split
    }
}
export class UserChoiceBuilder{
    constructor(uri){
        this.__split = new UserChoice(uri);
        this.__split.genURI();
        this.__split.isInitial = false;
        this.__split.isFinal = false;
        this.__split.isRequired = true;
        this.__split.isDisabled = false;
        this.__split.pathCondition = [];
    }
    setPairedTask( pairedTask ){
        this.__split.pairedTask = pairedTask;
        return this
    }
    setNumberOfPaths( numberOfPaths ){
        this.__split.numberOfPaths = numberOfPaths;
        return this
    }
    setName( name ){
        this.__split.name = `${name} (Split)`;
        return this
    }
    setPathCondition( pathIndex, condition ){
        let cpc = new ChoicePathCondition();
        cpc.genURI();
        cpc.pathIndex = pathIndex;
        cpc.condition = condition;
        this.__split.pathCondition.push(cpc);
        return this
    }
    setNullPathCondition( pathIndex ){
        let cpc = new ChoicePathCondition();
        cpc.genURI();
        cpc.pathIndex = pathIndex;
        cpc.condition = null;
        this.__split.pathCondition.push(cpc);
        return this
    }
    setDescription( description ){
        this.__split.description = description;
        return this
    }
    setRequired( required = true ){
        this.__split.isRequired = required;
        return this
    }
    setStartDate( date ){
        this.__split.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__split.expiryDate = date;
        return this
    }
    setRelativeStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setAbsoluteStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setRelativeExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    setAbsoluteExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    addToArray( array ){
        array.push(this.build().split);
        return this
    }
    build(){
        return this.__split
    }
}
export class OrJoinBuilder{
    constructor(uri){
        this.__join = new OrJoin(uri);
        this.__join.genURI();
        this.__join.isInitial = false;
        this.__join.isFinal = false;
        this.__join.isRequired = true;
        this.__join.isDisabled = false;

    }
    setPairedTask( pairedTask ){
        this.__join.pairedTask = pairedTask;
        return this
    }
    setNumberOfPaths( numberOfPaths ){
        this.__join.numberOfPaths = numberOfPaths;
        return this
    }
    setName( name ){
        this.__join.name = `${name} (Join)`;
        return this
    }
    setDescription( description ){
        this.__join.description = description;
        return this
    }
    setRequired( required = true ){
        this.__join.isRequired = required;
        return this
    }
    setStartDate( date ){
        this.__join.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__join.expiryDate = date;
        return this
    }
    setRelativeStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setAbsoluteStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setRelativeExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    setAbsoluteExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    addToArray( array ){
        array.push(this.build().join);
        return this
    }
    build(){
        return this.__join
    }
}
export class AndJoinBuilder{
    constructor(uri){
        this.__join = new AndJoin(uri);
        this.__join.genURI();
        this.__join.isInitial = false;
        this.__join.isFinal = false;
        this.__join.isRequired = true;
        this.__join.isDisabled = false;

    }
    setPairedTask( pairedTask ){
        this.__join.pairedTask = pairedTask;
        return this
    }
    setNumberOfPaths( numberOfPaths ){
        this.__join.numberOfPaths = numberOfPaths;
        return this
    }
    setName( name ){
        this.__join.name = `${name} (Join)`;
        return this
    }
    setDescription( description ){
        this.__join.description = description;
        return this
    }
    setRequired( required = true ){
        this.__join.isRequired = required;
        return this
    }
    setStartDate( date ){
        this.__join.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__join.expiryDate = date;
        return this
    }
    setRelativeStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setAbsoluteStartTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setStartDate( cd );
        return this
    }
    setRelativeExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = true;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    setAbsoluteExpiryTime( timeMillis ){
        let cd = new ConditionDate();
        cd.genURI();
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    addToArray( array ){
        array.push(this.build().join);
        return this
    }
    build(){
        return this.__join
    }
}