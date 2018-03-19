/**
 * Created by victorjose.gallego on 6/3/16.
 */
import {
    Task,
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
    DateType, } from './index';

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
    constructor(){
        this.__task = new Task();
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
    setOperator( operator ) {
        //UNCOMMENT if (!operator) throw new ReferenceError("Operator is undefined")
        this.__task.operator = operator;
        return this
    }
    setName( name ){
        this.__task.wfontology_Name = name;
        return this
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

        this.__sf.sourceTask = taskid instanceof Task ? taskid.uri : taskid
        this.__sf.sourceIndex = index

        return this
    }
    to( taskid, index ){
        if ( !taskid || index < 0 ) throw new Error("SequenceFlow construction error");

        this.__sf.targetTask = taskid instanceof Task ? taskid.uri : taskid;
        this.__sf.targetIndex = index;

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
        this.__wf.wfontology_Name = name;
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
        this.setStartDate( cd )
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
    constructor(){
        this.__split = new AutomaticChoice();
        this.__split.genURI();
        this.__split.isInitial = false;
        this.__split.isFinal = false;

        this.__join = new OrJoin();
        this.__join.genURI();
        this.__join.isInitial = false;
        this.__join.isFinal = false;

        this.__split.pairedTask = this.__join.uri;
        this.__join.pairedTask = this.__split.uri
    }
    setNumberOfPaths( numberOfPaths ){
        this.setNumberOfSplitPaths(numberOfPaths);
        this.setNumberOfJoinPaths(numberOfPaths);
        return this
    }
    setNumberOfSplitPaths( numberOfPaths ){
        this.__split.numberOfPaths = numberOfPaths;
        return this
    }
    setNumberOfJoinPaths( numberOfPaths ){
        this.__join.numberOfPaths = numberOfPaths;
        return this
    }
    setPathCondition( pathIndex, condition ){
        let cpc = ChoicePathCondition();
        cpc.genURI();
        cpc.pathIndex = pathIndex;
        cpc.condition = condition;
        this.__split.pathCondition.push(cpc);
        return this
    }
    setNullPathCondition( pathIndex ){
        let cpc = ChoicePathCondition();
        cpc.genURI();
        cpc.pathIndex = pathIndex;
        cpc.condition = null;
        this.__split.pathCondition.push(cpc);
        return this
    }
    setName( name ){
        this.__split.wfontology_Name = `${name} (Split)`;
        this.__join.wfontology_Name = `${name} (Join)`;
        return this
    }
    setDescription( description ){
        this.__split.description = description;
        this.__join.description = description;
        return this
    }
    setRequired( required = true ){
        this.__split.isRequired = required;
        this.__join.isRequired = required;
        return this
    }
    setStartDate( date ){
        this.__split.startDate = date;
        this.__join.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__split.expiryDate = date;
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
        cd.genURI()
        cd.isRelative = false;
        cd.time = timeMillis;
        this.setExpiryDate( cd );
        return this
    }
    addToArray( array ){
        array.push(this.build().split);
        array.push(this.build().join);
        return this
    }
    build(){
        if ( this.__split.numberOfPaths !== this.__split.pathCondition.length ) throw new Error("Number of paths != number of set path conditions")
        return { split: this.__split, join: this.__join}
    }
}
export class UserChoiceBuilder{
    constructor(){
        this.__split = new AutomaticChoice();
        this.__split.genURI();
        this.__split.isInitial = false;
        this.__split.isFinal = false;

        this.__join = new OrJoin();
        this.__join.genURI();
        this.__join.isInitial = false;
        this.__join.isFinal = false;

        this.__split.pairedTask = this.__join.uri;
        this.__join.pairedTask = this.__split.uri
    }
    setNumberOfPaths( numberOfPaths ){
        this.setNumberOfSplitPaths(numberOfPaths);
        this.setNumberOfJoinPaths(numberOfPaths);
        return this
    }
    setNumberOfSplitPaths( numberOfPaths ){
        this.__split.numberOfPaths = numberOfPaths;
        return this
    }
    setNumberOfJoinPaths( numberOfPaths ){
        this.__join.numberOfPaths = numberOfPaths;
        return this
    }
    setName( name ){
        this.__split.wfontology_Name = `${name} (Split)`;
        this.__join.wfontology_Name = `${name} (Join)`;
        return this
    }
    setDescription( description ){
        this.__split.description = description;
        this.__join.description = description;
        return this
    }
    setRequired( required = true ){
        this.__split.isRequired = required;
        this.__join.isRequired = required;
        return this
    }
    setStartDate( date ){
        this.__split.startDate = date;
        this.__join.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__split.expiryDate = date;
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
        array.push(this.build().split);
        array.push(this.build().join);
        return this
    }
    build(){
        return { split: this.__split, join: this.__join}
    }
}
export class AndSplitBuilder{
    constructor(){
        this.__split = new AutomaticChoice();
        this.__split.genURI();
        this.__split.isInitial = false;
        this.__split.isFinal = false;

        this.__join = new OrJoin();
        this.__join.genURI();
        this.__join.isInitial = false;
        this.__join.isFinal = false;

        this.__split.pairedTask = this.__join.uri;
        this.__join.pairedTask = this.__split.uri
    }
    setNumberOfPaths( numberOfPaths ){
        this.setNumberOfSplitPaths(numberOfPaths);
        this.setNumberOfJoinPaths(numberOfPaths);
        return this
    }
    setNumberOfSplitPaths( numberOfPaths ){
        this.__split.numberOfPaths = numberOfPaths;
        return this
    }
    setNumberOfJoinPaths( numberOfPaths ){
        this.__join.numberOfPaths = numberOfPaths;
        return this
    }
    setName( name ){
        this.__split.wfontology_Name = `${name} (Split)`;
        this.__join.wfontology_Name = `${name} (Join)`;
        return this
    }
    setDescription( description ){
        this.__split.description = description;
        this.__join.description = description;
        return this
    }
    setRequired( required = true ){
        this.__split.isRequired = required;
        this.__join.isRequired = required;
        return this
    }
    setStartDate( date ){
        this.__split.startDate = date;
        this.__join.startDate = date;
        return this
    }
    setExpiryDate( date ){
        this.__split.expiryDate = date;
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
        array.push(this.build().split);
        array.push(this.build().join);
        return this
    }
    build(){
        return { split: this.__split, join: this.__join}
    }
}
export class ParameterValueBuilder{
    constructor(){
        this.__pv = new ParameterValue()
    }
    setParameter( parameter ){
        this.__pv.namedParameter = parameter;
        return this
    }
    setParameterFromOperator( operator, parameterName ){
        let parameter = operator.parameter.filter(x => x.wfontology_Name === parameterName);
        if (parameter.length === 0) throw new Error("Parameter "+parameterName+" not found in operator "+operator.wfontology_Name)
        this.setParameter(parameter[0]);
        return this
    }
    setParameterIntegerValue( value ){
        let val = new IntegerType();
        val.integerValue = Number.parseInt(value);
        this.__pv.namedParameterValue = val;
        return this
    }
    setParameterFloatValue( value ){
        let val = new FloatType();
        val.floatValue = Number.parseFloat(value);
        this.__pv.namedParameterValue = val;
        return this
    }
    setParameterStringValue( value ){
        let val = new StringType();
        val.stringValue = value;
        this.__pv.namedParameterValue = val;
        return this
    }
    setParameterBooleanValue( value ){
        let val = new BooleanType();
        val.booleanValue = !!value;
        this.__pv.namedParameterValue = val;
        return this
    }
    setParameterDateValue( value ){
        let val = new DateType();
        val.dateValue = value;
        this.__pv.namedParameterValue = val;
        return this
    }
    setParameterSortValue( value ){
        this.__pv.namedParameterValue = value;
        return this
    }
    build(){
        return this.__pv
    }
}