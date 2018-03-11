export class Class {
    constructor(name, canonicalName, uri) {
        this.name = name;
        this.canonicalName = canonicalName;
        this.uri = uri;
    }
    getName() {
        return this.name;
    }
    getCanonicalName() {
        return this.canonicalName;
    }
    getURI() {
	    return this.uri;
    }
}

function guid() {
    var g = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	return v.toString(16);
    });
    return g;
}

export class Thing {
    constructor(obj,  reimport = true) {
        this['@class'] = "es.usc.citius.hmb.model.Thing";
        this.uri = null;
        if (reimport) {
            this.importFromObject(obj)
        }
    }
    genURI() {
        if (this.uri == null || this.uri.length <= 0) {
            this.uri = guid();
        }
    }
    getClassName() {
        return this.constructor.name;
    }
    getCanonicalClassName() {
        return this['@class'];
    }
    getClass() {
	    return new Class(this.constructor.name, this['@class'], this.constructor['URI'])
    }
    importFromObject(obj) {
        if (obj) {
            Object.keys(obj).map(key => {
                if (this[key] !== undefined) {
                    this[key] = obj[key];
                }
            });
            if (this.uri) {
                this._id = this.uri;
            }
        }
    }
}
/*    OperatorResourceAdapter class    */
export class OperatorResourceAdapter extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.OperatorResourceAdapter";
		this.operator = null; // Operator
		this.resource = null; // Resource
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
OperatorResourceAdapter.URI = "http://citius.usc.es/hmb/wfontology.owl#Operator_Resource_Adapter";


/*    ParameterValue class    */
export class ParameterValue extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ParameterValue";
		this.namedParameter = null; // Parameter
		this.namedParameterValue = null; // Sort
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ParameterValue.URI = "http://citius.usc.es/hmb/wfontology.owl#ParameterValue";


/*    Service class    */
export class Service extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Service";
		this.serviceGrounding = null; // ServiceGrounding
		this.serviceOperation = []; // ServiceOperation
		this.serviceonto_Name = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Service.URI = "http://citius.usc.es/hmb/serviceonto.owl#Service";


/*    Sort class    */
export class Sort extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Sort";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Sort.URI = "http://citius.usc.es/hmb/wfontology.owl#Sort";


/*    ActionParameterValue class    */
export class ActionParameterValue extends Sort {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ActionParameterValue";
		this.namedActionParameter = null; // ActionDescriptorParameter
		this.namedActionParameterValue = null; // Sort
		this.parameterName = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ActionParameterValue.URI = "http://citius.usc.es/hmb/wfontology.owl#ActionParameterValue";


/*    DomainDataObject class    */
export class DomainDataObject extends Sort {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.DomainDataObject";
		this.referenceId = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
DomainDataObject.URI = "http://citius.usc.es/hmb/imagames.owl#DomainDataObject";


/*    Geolocation class    */
export class Geolocation extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.Geolocation";
		this.latitude = null; // Float
		this.longitude = null; // Float
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Geolocation.URI = "http://citius.usc.es/hmb/imagames.owl#Geolocation";


/*    QuestionnaireAnswer class    */
export class QuestionnaireAnswer extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.QuestionnaireAnswer";
		this.questionAnswer = []; // QuestionAnswer
		this.questionnaireReferenceId = null; // String
		this.timestamp = null; // Long
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
QuestionnaireAnswer.URI = "http://citius.usc.es/hmb/imagames.owl#QuestionnaireAnswer";


/*    QuestionAnswer class    */
export class QuestionAnswer extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.QuestionAnswer";
		this.questionId = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
QuestionAnswer.URI = "http://citius.usc.es/hmb/imagames.owl#QuestionAnswer";


/*    TextQuestionAnswer class    */
export class TextQuestionAnswer extends QuestionAnswer {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.TextQuestionAnswer";
		this.textResponse = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
TextQuestionAnswer.URI = "http://citius.usc.es/hmb/imagames.owl#TextQuestionAnswer";


/*    SingleAnswerQuestionAnswer class    */
export class SingleAnswerQuestionAnswer extends QuestionAnswer {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.SingleAnswerQuestionAnswer";
		this.selectedOption = null; // Option
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
SingleAnswerQuestionAnswer.URI = "http://citius.usc.es/hmb/imagames.owl#SingleAnswerQuestionAnswer";


/*    MultipleAnswerQuestionAnswer class    */
export class MultipleAnswerQuestionAnswer extends QuestionAnswer {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.MultipleAnswerQuestionAnswer";
		this.selectedOptions = []; // Option
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
MultipleAnswerQuestionAnswer.URI = "http://citius.usc.es/hmb/imagames.owl#MultipleAnswerQuestionAnswer";


/*    TrueOrFalseQuestionAnswer class    */
export class TrueOrFalseQuestionAnswer extends QuestionAnswer {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.TrueOrFalseQuestionAnswer";
		this.booleanResponse = null; // Boolean
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
TrueOrFalseQuestionAnswer.URI = "http://citius.usc.es/hmb/imagames.owl#TrueOrFalseQuestionAnswer";


/*    Term class    */
export class Term extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.Term";
		this.definition = null; // String
		this.term = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Term.URI = "http://citius.usc.es/hmb/imagames.owl#Term";


/*    BadgeReference class    */
export class BadgeReference extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.BadgeReference";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
BadgeReference.URI = "http://citius.usc.es/hmb/imagames.owl#BadgeReference";


/*    PictureReference class    */
export class PictureReference extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.PictureReference";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
PictureReference.URI = "http://citius.usc.es/hmb/imagames.owl#PictureReference";


/*    EmailReference class    */
export class EmailReference extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.EmailReference";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
EmailReference.URI = "http://citius.usc.es/hmb/imagames.owl#EmailReference";


/*    CheckInReference class    */
export class CheckInReference extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.CheckInReference";
		this.siteReference = null; // SiteReference
		this.timestamp = null; // Long
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
CheckInReference.URI = "http://citius.usc.es/hmb/imagames.owl#CheckInReference";


/*    TermsAndDefinitionsAnswer class    */
export class TermsAndDefinitionsAnswer extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.TermsAndDefinitionsAnswer";
		this.terms = []; // Term
		this.timestamp = null; // Long
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
TermsAndDefinitionsAnswer.URI = "http://citius.usc.es/hmb/imagames.owl#TermsAndDefinitionsAnswer";


/*    SiteReference class    */
export class SiteReference extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.SiteReference";
		this.dataDescription = null; // String
		this.dataName = null; // String
		this.geolocation = null; // Geolocation
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
SiteReference.URI = "http://citius.usc.es/hmb/imagames.owl#SiteReference";


/*    ImageArea class    */
export class ImageArea extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.ImageArea";
		this.index = null; // Integer
		this.maxX = null; // Float
		this.maxY = null; // Float
		this.minX = null; // Float
		this.minY = null; // Float
		this.text = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ImageArea.URI = "http://citius.usc.es/hmb/imagames.owl#ImageArea";


/*    SMSReference class    */
export class SMSReference extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.SMSReference";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
SMSReference.URI = "http://citius.usc.es/hmb/imagames.owl#SMSReference";


/*    TermsAndDefinitions class    */
export class TermsAndDefinitions extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.TermsAndDefinitions";
		this.points = null; // Integer
		this.terms = []; // Term
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
TermsAndDefinitions.URI = "http://citius.usc.es/hmb/imagames.owl#TermsAndDefinitions";


/*    ImageSelectionAreas class    */
export class ImageSelectionAreas extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.ImageSelectionAreas";
		this.areas = []; // ImageArea
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ImageSelectionAreas.URI = "http://citius.usc.es/hmb/imagames.owl#ImageSelectionAreas";


/*    QuestionnaireReference class    */
export class QuestionnaireReference extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.QuestionnaireReference";
		this.dataDescription = null; // String
		this.dataName = null; // String
		this.geolocation = null; // Geolocation
		this.question = []; // Question
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
QuestionnaireReference.URI = "http://citius.usc.es/hmb/imagames.owl#QuestionnaireReference";


/*    AudioReference class    */
export class AudioReference extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.AudioReference";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
AudioReference.URI = "http://citius.usc.es/hmb/imagames.owl#AudioReference";


/*    Question class    */
export class Question extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.Question";
		this.points = null; // Integer
		this.text = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Question.URI = "http://citius.usc.es/hmb/imagames.owl#Question";


/*    MultipleAnswerQuestion class    */
export class MultipleAnswerQuestion extends Question {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.MultipleAnswerQuestion";
		this.correctOptions = []; // String
		this.options = []; // Option
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
MultipleAnswerQuestion.URI = "http://citius.usc.es/hmb/imagames.owl#MultipleAnswerQuestion";


/*    TrueOrFalseQuestion class    */
export class TrueOrFalseQuestion extends Question {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.TrueOrFalseQuestion";
		this.booleanResponse = null; // Boolean
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
TrueOrFalseQuestion.URI = "http://citius.usc.es/hmb/imagames.owl#TrueOrFalseQuestion";


/*    SingleAnswerQuestion class    */
export class SingleAnswerQuestion extends Question {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.SingleAnswerQuestion";
		this.correctOption = null; // String
		this.options = []; // Option
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
SingleAnswerQuestion.URI = "http://citius.usc.es/hmb/imagames.owl#SingleAnswerQuestion";


/*    TextQuestion class    */
export class TextQuestion extends Question {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.TextQuestion";
		this.textResponse = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
TextQuestion.URI = "http://citius.usc.es/hmb/imagames.owl#TextQuestion";


/*    Option class    */
export class Option extends DomainDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.imagames.model.Option";
		this.optionType = null; // String
		this.text = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Option.URI = "http://citius.usc.es/hmb/imagames.owl#Option";


/*    Action class    */
export class Action extends Sort {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Action";
		this.actionDescriptor = null; // ActionDescriptor
		this.actionParameterValue = []; // ActionParameterValue
		this.actionReference = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Action.URI = "http://citius.usc.es/hmb/wfontology.owl#Action";


/*    UserAction class    */
export class UserAction extends Action {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.UserAction";
		this.userReference = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
UserAction.URI = "http://citius.usc.es/hmb/wfontology.owl#UserAction";


/*    NativeDataObject class    */
export class NativeDataObject extends Sort {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.NativeDataObject";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
NativeDataObject.URI = "http://citius.usc.es/hmb/wfontology.owl#NativeDataObject";


/*    DateType class    */
export class DateType extends NativeDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.DateType";
		this.dateValue = null; // GregorianCalendar
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
DateType.URI = "http://citius.usc.es/hmb/wfontology.owl#DateType";


/*    BooleanType class    */
export class BooleanType extends NativeDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.BooleanType";
		this.booleanValue = null; // Boolean
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
BooleanType.URI = "http://citius.usc.es/hmb/wfontology.owl#BooleanType";


/*    FloatType class    */
export class FloatType extends NativeDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.FloatType";
		this.floatValue = null; // Float
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
FloatType.URI = "http://citius.usc.es/hmb/wfontology.owl#FloatType";


/*    IntegerType class    */
export class IntegerType extends NativeDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.IntegerType";
		this.integerValue = null; // Integer
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
IntegerType.URI = "http://citius.usc.es/hmb/wfontology.owl#IntegerType";


/*    StringType class    */
export class StringType extends NativeDataObject {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.StringType";
		this.stringValue = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
StringType.URI = "http://citius.usc.es/hmb/wfontology.owl#StringType";


/*    WorkflowTrigger class    */
export class WorkflowTrigger extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.WorkflowTrigger";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
WorkflowTrigger.URI = "http://citius.usc.es/hmb/wfontology.owl#WorkflowTrigger";


/*    WorkflowRuleTrigger class    */
export class WorkflowRuleTrigger extends WorkflowTrigger {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.WorkflowRuleTrigger";
		this.ruleReference = null; // RuleReference
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
WorkflowRuleTrigger.URI = "http://citius.usc.es/hmb/wfontology.owl#WorkflowRuleTrigger";


/*    Knowledge class    */
export class Knowledge extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Knowledge";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Knowledge.URI = "http://citius.usc.es/hmb/wfontology.owl#Knowledge";


/*    Property class    */
export class Property extends Knowledge {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Property";
		this.displayDescription = null; // String
		this.displayName = null; // String
		this.metadata = []; // Metadata
		this.propertyContext = null; // PropertyContext
		this.propertySource = null; // PropertySource
		this.provider = null; // String
		this.tagReference = []; // String
		this.wfontology_Name = null; // String
		this.wfontology_Type = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Property.URI = "http://citius.usc.es/hmb/wfontology.owl#Property";


/*    MultiValueProperty class    */
export class MultiValueProperty extends Property {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.MultiValueProperty";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
MultiValueProperty.URI = "http://citius.usc.es/hmb/wfontology.owl#MultiValueProperty";


/*    ListValueProperty class    */
export class ListValueProperty extends Property {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ListValueProperty";
		this.permittedValue = []; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ListValueProperty.URI = "http://citius.usc.es/hmb/wfontology.owl#ListValueProperty";


/*    SingleValueProperty class    */
export class SingleValueProperty extends Property {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.SingleValueProperty";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
SingleValueProperty.URI = "http://citius.usc.es/hmb/wfontology.owl#SingleValueProperty";


/*    PropertyContext class    */
export class PropertyContext extends Knowledge {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.PropertyContext";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
PropertyContext.URI = "http://citius.usc.es/hmb/wfontology.owl#PropertyContext";


/*    PropertySource class    */
export class PropertySource extends Knowledge {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.PropertySource";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
PropertySource.URI = "http://citius.usc.es/hmb/wfontology.owl#PropertySource";


/*    RuleReference class    */
export class RuleReference extends Knowledge {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.RuleReference";
		this.provider = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
RuleReference.URI = "http://citius.usc.es/hmb/wfontology.owl#RuleReference";


/*    FileRuleBase class    */
export class FileRuleBase extends RuleReference {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.FileRuleBase";
		this.filename = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
FileRuleBase.URI = "http://citius.usc.es/hmb/wfontology.owl#FileRuleBase";


/*    SingleRule class    */
export class SingleRule extends RuleReference {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.SingleRule";
		this.ruleId = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
SingleRule.URI = "http://citius.usc.es/hmb/wfontology.owl#SingleRule";


/*    RuleBase class    */
export class RuleBase extends RuleReference {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.RuleBase";
		this.ruleBaseId = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
RuleBase.URI = "http://citius.usc.es/hmb/wfontology.owl#RuleBase";


/*    User class    */
export class User extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.User";
		this.completeName = null; // String
		this.email = null; // String
		this.globalTagReference = []; // String
		this.passwordSHA = null; // String
		this.systemontology_Name = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
User.URI = "http://citius.usc.es/hmb/systemontology.owl#User";


/*    SequenceFlow class    */
export class SequenceFlow extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.SequenceFlow";
		this.isDisabled = null; // Boolean
		this.lastVersionNumber = null; // Integer
		this.sourceIndex = null; // Integer
		this.sourceTask = null; // String
		this.targetIndex = null; // Integer
		this.targetTask = null; // String
		this.versionNumber = null; // Integer
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
SequenceFlow.URI = "http://citius.usc.es/hmb/wfontology.owl#SequenceFlow";


/*    ConditionDate class    */
export class ConditionDate extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ConditionDate";
		this.isRelative = null; // Boolean
		this.time = null; // Long
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ConditionDate.URI = "http://citius.usc.es/hmb/wfontology.owl#ConditionDate";


/*    ActionDescriptorParameter class    */
export class ActionDescriptorParameter extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ActionDescriptorParameter";
		this.displayName = null; // String
		this.wfontology_Name = null; // String
		this.wfontology_Type = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ActionDescriptorParameter.URI = "http://citius.usc.es/hmb/wfontology.owl#ActionDescriptorParameter";


/*    Metadata class    */
export class Metadata extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Metadata";
		this.metadataValue = null; // String
		this.wfontology_Name = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Metadata.URI = "http://citius.usc.es/hmb/wfontology.owl#Metadata";


/*    Tag class    */
export class Tag extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Tag";
		this.displayName = null; // String
		this.isSubTagOf = []; // Tag
		this.provider = null; // String
		this.user = []; // User
		this.wfontology_Name = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Tag.URI = "http://citius.usc.es/hmb/wfontology.owl#Tag";


/*    ChoicePathCondition class    */
export class ChoicePathCondition extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ChoicePathCondition";
		this.condition = null; // String
		this.pathIndex = null; // Integer
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ChoicePathCondition.URI = "http://citius.usc.es/hmb/wfontology.owl#ChoicePathCondition";


/*    WorkflowTemplate class    */
export class WorkflowTemplate extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.WorkflowTemplate";
		this.description = null; // String
		this.designer = null; // User
		this.element = []; // Task
		this.expiryDate = null; // ConditionDate
		this.isDesignFinished = null; // Boolean
		this.isValidated = null; // Boolean
		this.metadata = []; // Metadata
		this.modificationDate = null; // Long
		this.provider = null; // String
		this.sequenceFlow = []; // SequenceFlow
		this.startDate = null; // ConditionDate
		this.trigger = null; // WorkflowTrigger
		this.versionNumber = null; // Integer
		this.wfontology_Name = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
WorkflowTemplate.URI = "http://citius.usc.es/hmb/wfontology.owl#WorkflowTemplate";


/*    Workflow class    */
export class Workflow extends WorkflowTemplate {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Workflow";
		this.executionId = null; // String
		this.executionStatus = null; // String
		this.isSubWorkflow = null; // Boolean
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Workflow.URI = "http://citius.usc.es/hmb/wfontology.owl#Workflow";


/*    Task class    */
export class Task extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Task";
		this.description = null; // String
		this.expiryDate = null; // ConditionDate
		this.isDisabled = null; // Boolean
		this.isFinal = null; // Boolean
		this.isInitial = null; // Boolean
		this.isRequired = null; // Boolean
		this.lastVersionNumber = null; // Integer
		this.operator = null; // Operator
		this.pairedTask = null; // String
		this.parameterValue = []; // ParameterValue
		this.startDate = null; // ConditionDate
		this.tagReference = []; // String
		this.user = []; // User
		this.versionNumber = null; // Integer
		this.wfontology_Name = null; // String
		this.workflow = null; // Workflow
		this.xposition = null; // Integer
		this.yposition = null; // Integer
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Task.URI = "http://citius.usc.es/hmb/wfontology.owl#Task";


/*    HumanTask class    */
export class HumanTask extends Task {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.HumanTask";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
HumanTask.URI = "http://citius.usc.es/hmb/wfontology.owl#HumanTask";


/*    UserChoice class    */
export class UserChoice extends HumanTask {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.UserChoice";
		this.numberOfPaths = null; // Integer
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
UserChoice.URI = "http://citius.usc.es/hmb/wfontology.owl#UserChoice";


/*    AutomaticTask class    */
export class AutomaticTask extends Task {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.AutomaticTask";
		this.numberOfPaths = null; // Integer
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
AutomaticTask.URI = "http://citius.usc.es/hmb/wfontology.owl#AutomaticTask";


/*    OrJoin class    */
export class OrJoin extends AutomaticTask {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.OrJoin";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
OrJoin.URI = "http://citius.usc.es/hmb/wfontology.owl#OrJoin";


/*    AutomaticChoice class    */
export class AutomaticChoice extends AutomaticTask {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.AutomaticChoice";
		this.pathCondition = []; // ChoicePathCondition
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
AutomaticChoice.URI = "http://citius.usc.es/hmb/wfontology.owl#AutomaticChoice";


/*    Split class    */
export class Split extends AutomaticTask {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Split";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Split.URI = "http://citius.usc.es/hmb/wfontology.owl#Split";


/*    AndJoin class    */
export class AndJoin extends AutomaticTask {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.AndJoin";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
AndJoin.URI = "http://citius.usc.es/hmb/wfontology.owl#AndJoin";


/*    ServiceGrounding class    */
export class ServiceGrounding extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ServiceGrounding";
		this.endPoint = null; // String
		this.isSystemService = null; // Boolean
		this.namespace = null; // String
		this.servicePackageFile = null; // String
		this.serviceVersion = null; // Integer
		this.typeNamespace = null; // String
		this.wsdlurl = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ServiceGrounding.URI = "http://citius.usc.es/hmb/serviceonto.owl#ServiceGrounding";


/*    Parameter class    */
export class Parameter extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Parameter";
		this.isMandatory = null; // Boolean
		this.wfontology_Name = null; // String
		this.wfontology_Type = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Parameter.URI = "http://citius.usc.es/hmb/wfontology.owl#Parameter";


/*    Resource class    */
export class Resource extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Resource";
		this.implements = null; // Operator
		this.wfontology_Name = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Resource.URI = "http://citius.usc.es/hmb/wfontology.owl#Resource";


/*    ServiceOperation class    */
export class ServiceOperation extends Resource {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ServiceOperation";
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ServiceOperation.URI = "http://citius.usc.es/hmb/serviceonto.owl#ServiceOperation";


/*    Operator class    */
export class Operator extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.Operator";
		this.description = null; // String
		this.evaluatesProperty = []; // Property
		this.parameter = []; // Parameter
		this.provider = null; // String
		this.readsProperty = []; // Property
		this.ruleReference = null; // RuleReference
		this.wfontology_Name = null; // String
		this.writesProperty = []; // Property
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
Operator.URI = "http://citius.usc.es/hmb/wfontology.owl#Operator";


/*    ActionDescriptor class    */
export class ActionDescriptor extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ActionDescriptor";
		this.actionDescriptorParameter = []; // ActionDescriptorParameter
		this.category = null; // String
		this.description = null; // String
		this.displayName = null; // String
		this.wfontology_Name = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ActionDescriptor.URI = "http://citius.usc.es/hmb/wfontology.owl#ActionDescriptor";


/*    ActionGroup class    */
export class ActionGroup extends Thing {
	constructor(obj, reimport = true) {
		super(obj, false);
		this['@class'] = "es.usc.citius.hmb.model.ActionGroup";
		this.actionDescriptors = []; // ActionDescriptor
		this.description = null; // String
		this.displayName = null; // String
		this.wfontology_Name = null; // String
		if (reimport) {
			super.importFromObject(obj)
		}
	}
}
ActionGroup.URI = "http://citius.usc.es/hmb/wfontology.owl#ActionGroup";

