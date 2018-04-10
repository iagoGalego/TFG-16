class Thing {
    static RDFS_CLASS = 'http://www.w3.org/2000/01/rdf-schema#Class';
    URI = undefined
    isLoaded = undefined

    constructor(options = {}) {
        if (options['uri']) {
            this.URI = options['uri'];
        }
    }
    genURI() {
        if (this.URI === null || this.URI.length <= 0) {
            this.URI = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                let r = Math.random()*16|0
                let v = c === 'x' ? r : (r&0x3|0x8)
                return v.toString(16)
            })
        }
    }
}
export { Thing }

class Sort extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Sort';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Sort";
    }
}
export { Sort }

class ActionDescriptorParameter extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#ActionDescriptorParameter';
    displayName = undefined
    name = undefined
    type = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ActionDescriptorParameter";
    }
}
export { ActionDescriptorParameter }

class ActionDescriptor extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#ActionDescriptor';
    category = undefined
    description = undefined
    displayName = undefined
    name = undefined
    actionDescriptorParameter = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ActionDescriptor";
    }
}
export { ActionDescriptor }

class Action extends Sort {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Action';
    actionDescriptor = undefined
    actionParameterValue = undefined
    actionReference = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Action";
    }
}
export { Action }

class ActionParameterValue extends Action {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#ActionParameterValue';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ActionParameterValue";
    }
}
export { ActionParameterValue }

class ActionGroup extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#ActionGroup';
    actionDescriptor = undefined
    name = undefined
    description = undefined
    displayName = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ActionGroup";
    }
}
export { ActionGroup }

class ChoicePathCondition extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#ChoicePathCondition';
    condition = undefined
    pathIndex = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ChoicePathCondition";
    }
}
export { ChoicePathCondition }

class ConditionDate extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#ConditionDate';
    time = undefined
    isRelative = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ConditionDate";
    }
}
export { ConditionDate }

class Knowledge extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Knowledge';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Knowledge";
    }
}
export { Knowledge }

class PropertySource extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#PropertySource';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.PropertySource";
    }
}
export { PropertySource }

class PropertyContext extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#PropertyContext';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.PropertyContext";
    }
}
export { PropertyContext }

class Metadata extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Metadata';
    name = undefined
    metadataValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Metadata";
    }
}
export { Metadata }

class Property extends Knowledge {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Property';
    aggregationOperator = undefined
    displayDescription = undefined
    displayName = undefined
    name = undefined
    provider = undefined
    tagReference = undefined
    type = undefined
    metadata = undefined
    propertyContext = undefined
    propertySource = undefined
    isAvailableForRules = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Property";
    }
}
export { Property }

class ListValueProperty extends Property {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#ListValueProperty';
    permittedValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ListValueProperty";
    }
}
export { ListValueProperty }

class MultiValueProperty extends Property {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#MultiValueProperty';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.MultiValueProperty";
    }
}
export { MultiValueProperty }

class SingleValueProperty extends Property {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#SingleValueProperty';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.SingleValueProperty";
    }
}
export { SingleValueProperty }

class RuleReference extends Knowledge {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#RuleReference';
    provider = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.RuleReference";
    }
}
export { RuleReference }

class FileRuleBase extends RuleReference {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#FileRuleBase';
    filename = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.FileRuleBase";
    }
}
export { FileRuleBase }

class RuleBase extends RuleReference {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#RuleBase';
    ruleBaseId = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.RuleBase";
    }
}
export { RuleBase }

class SingleRule extends RuleReference {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#SingleRule';
    ruleId = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.SingleRule";
    }
}
export { SingleRule }

class UserAction extends Action {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#UserAction';
    userReference = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.UserAction";
    }
}
export { UserAction }

class NativeDataObject extends Sort {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#NativeDataObject';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.NativeDataObject";
    }
}
export { NativeDataObject }

class BooleanType extends NativeDataObject {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#BooleanType';
    booleanValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.BooleanType";
    }
}
export { BooleanType }

class DateType extends NativeDataObject {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#DateType';
    dateValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.DateType";
    }
}
export { DateType }

class LongType extends NativeDataObject {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#LongType';
    longValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.LongType";
    }
}
export { LongType }

class DoubleType extends NativeDataObject {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#DoubleType';
    doubleValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.DoubleType";
    }
}
export { DoubleType }

class FloatType extends NativeDataObject {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#FloatType';
    floatValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.FloatType";
    }
}
export { FloatType }

class IntegerType extends NativeDataObject {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#IntegerType';
    integerValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.IntegerType";
    }
}
export { IntegerType }

class StringType extends NativeDataObject {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#StringType';
    stringValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.StringType";
    }
}
export { StringType }

class Parameter extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Parameter';
    name = undefined
    type = undefined
    isMandatory = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Parameter";
    }
}
export { Parameter }

class ParameterValue extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#ParameterValue';
    namedParameter = undefined
    namedParameterValue = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ParameterValue";
    }
}
export { ParameterValue }

class Operator extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Operator';
    evaluatesProperty = undefined
    name = undefined
    description = undefined
    provider = undefined
    parameter = undefined
    ruleReference = undefined
    readsProperty = undefined
    writesProperty = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Operator";
    }
}
export { Operator }

class Resource extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Resource';
    name = undefined
    mImplements = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Resource";
    }
}
export { Resource }

class Operator_Resource_Adapter extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Operator_Resource_Adapter';
    operator = undefined
    resource = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Operator_Resource_Adapter";
    }
}
export { Operator_Resource_Adapter }

class SequenceFlow extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#SequenceFlow';
    lastVersionNumber = undefined
    sourceIndex = undefined
    sourceTask = undefined
    targetIndex = undefined
    targetTask = undefined
    versionNumber = undefined
    isDisabled = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.SequenceFlow";
    }
}
export { SequenceFlow }

class Tag extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Tag';
    name = undefined
    displayName = undefined
    provider = undefined
    isSubTagOf = undefined
    user = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Tag";
    }
}
export { Tag }

class Task extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Task';
    name = undefined
    description = undefined
    expiryDate = undefined
    startDate = undefined
    lastVersionNumber = undefined
    metadata = undefined
    operator = undefined
    pairedTask = undefined
    parameterValue = undefined
    pathId = undefined
    tagReference = undefined
    versionNumber = undefined
    workflow = undefined
    xPosition = undefined
    yPosition = undefined
    isDisabled = undefined
    isFinal = undefined
    isInitial = undefined
    isRequired = undefined
    user = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Task";
    }
}
export { Task }

class AutomaticTask extends Task {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#AutomaticTask';
    numberOfPaths = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.AutomaticTask";
    }
}
export { AutomaticTask }

class AndJoin extends AutomaticTask {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#AndJoin';
    localAggregationRules = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.AndJoin";
    }
}
export { AndJoin }

class AutomaticChoice extends AutomaticTask {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#AutomaticChoice';
    pathCondition = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.AutomaticChoice";
    }
}
export { AutomaticChoice }

class OrJoin extends AutomaticTask {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#OrJoin';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.OrJoin";
    }
}
export { OrJoin }

class Split extends AutomaticTask {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Split';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Split";
    }
}
export { Split }

class HumanTask extends Task {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#HumanTask';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.HumanTask";
    }
}
export { HumanTask }

class UserChoice extends HumanTask {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#UserChoice';
    numberOfPaths = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.UserChoice";
    }
}
export { UserChoice }

class WorkflowTrigger extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#WorkflowTrigger';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.WorkflowTrigger";
    }
}
export { WorkflowTrigger }

class WorkflowRuleTrigger extends WorkflowTrigger {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#WorkflowRuleTrigger';
    ruleReference = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.WorkflowRuleTrigger";
    }
}
export { WorkflowRuleTrigger }

class WorkflowTemplate extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#WorkflowTemplate';
    name = undefined
    description = undefined
    startDate = undefined
    expiryDate = undefined
    metadata = undefined
    modificationDate = undefined
    provider = undefined
    element = undefined
    sequenceFlow = undefined
    trigger = undefined
    versionNumber = undefined
    isDesignFinished = undefined
    isValidated = undefined
    designer = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.WorkflowTemplate";
    }
}
export { WorkflowTemplate }

class Workflow extends WorkflowTemplate {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#Workflow';
    executionId = undefined
    executionStatus = undefined
    isSubWorkflow = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Workflow";
    }
}
export { Workflow }

class HistoryEntry extends Sort {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#HistoryEntry';
    property = undefined
    user = undefined
    values = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.HistoryEntry";
    }
}
export { HistoryEntry }

class ServiceGrounding extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/serviceonto.owl#ServiceGrounding';
    endPoint = undefined
    namespace = undefined
    servicePackageFile = undefined
    serviceVersion = undefined
    typeNamespace = undefined
    WSDLURL = undefined
    systemService = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ServiceGrounding";
    }
}
export { ServiceGrounding }

class ServiceOperation extends Resource {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/serviceonto.owl#ServiceOperation';
    name = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.ServiceOperation";
    }
}
export { ServiceOperation }

class Service extends Thing {
    name = undefined
    serviceGrounding = undefined
    serviceOperation = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.Service";
    }
}
export { Service }

class User extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/systemontology.owl#User';
    name = undefined
    email = undefined
    completeName = undefined
    passwordSHA = undefined
    globalTagReference = undefined
    metadata = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.User";
    }
}
export { User }

class TaskExecution extends Thing {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/systemontology.owl#TaskExecution';
    name = undefined
    email = undefined
    completeName = undefined
    passwordSHA = undefined
    globalTagReference = undefined
    metadata = undefined

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.TaskExecution";
    }
}
export { TaskExecution }

