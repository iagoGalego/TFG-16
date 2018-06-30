class Thing {
    static RDFS_CLASS = 'http://www.w3.org/2000/01/rdf-schema#Class';
    uri = undefined
    isLoaded = undefined

    constructor(options = {}) {
        if (options['uri']) {
            this.uri = options['uri'];
        }
    }
    genURI() {
        if (this.uri === undefined || this.uri === null || this.uri.length <= 0) {
            this.uri = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
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

class NativeDataObject extends Sort {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#NativeDataObject';

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.NativeDataObject";
    }
}

class StringType extends NativeDataObject {
    static RDFS_CLASS = 'http://citius.usc.es/hmb/wfontology.owl#StringType';
    stringValue = undefined;

    constructor(options = {}) {
        super(options);
        this['@class'] = "es.usc.citius.hmb.model.StringType";
    }
}
export { StringType }

class Tag extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#Tag';
	value = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.Tag";
	}
}
export { Tag }

class QuestionType extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#QuestionType';

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.QuestionType";
	}
}
export { QuestionType }

class AnswerType extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#AnswerType';

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.AnswerType";
	}
}
export { AnswerType }

class Question extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#Question';
	statement = undefined
	questionType = undefined
	answerType = undefined
	tags = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.Question";
	}
}
export { Question }

class VideoQuestionType extends QuestionType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#VideoQuestionType';
	videoURL = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.VideoQuestionType";
	}
}
export { VideoQuestionType }

class PictureQuestionType extends QuestionType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#PictureQuestionType';
	imageURL = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.PictureQuestionType";
	}
}
export { PictureQuestionType }

class Option extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#Option';
	text = undefined
	score = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.Option";
	}
}
export { Option }

class OptionQuestionType extends AnswerType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#OptionQuestionType';
	options = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.OptionQuestionType";
	}
}
export { OptionQuestionType }

class ChooseOneOptionQuestion extends OptionQuestionType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#ChooseOneOptionQuestion';
	solution = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.ChooseOneOptionQuestion";
	}
}
export { ChooseOneOptionQuestion }

class ChooseVariousOptionsQuestion extends OptionQuestionType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#ChooseVariousOptionsQuestion';
	solutions = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.ChooseVariousOptionsQuestion";
	}
}
export { ChooseVariousOptionsQuestion }

class TrueFalseQuestionType extends AnswerType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#TrueFalseQuestionType';
	solution = undefined
	score = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.TrueFalseQuestionType";
	}
}
export { TrueFalseQuestionType }

class TextQuestionType extends AnswerType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#TextQuestionType';

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.TextQuestionType";
	}
}
export { TextQuestionType }

class TextSolution extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#TextSolution';
	solution = undefined
	score = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.TextSolution";
	}
}
export { TextSolution }

class InsertOneTextQuestion extends TextQuestionType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#InsertOneTextQuestion';
	solution = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.InsertOneTextQuestion";
	}
}
export { InsertOneTextQuestion }

class InsertVariousTextsQuestion extends TextQuestionType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#InsertVariousTextsQuestion';
	solutions = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.InsertVariousTextsQuestion";
	}
}
export { InsertVariousTextsQuestion }

class FillInTheBlanksQuestionType extends AnswerType {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#FillInTheBlanksQuestionType';
	sentence = undefined
    solutions = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.FillInTheBlanksQuestionType";
	}
}
export { FillInTheBlanksQuestionType }

class Questionnaire extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#Questionnaire';
	name = undefined
	questions = undefined
	tags = undefined
	user = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.Questionnaire";
	}
}
export { Questionnaire }

class QuestionWithRating extends Question {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#QuestionWithRating';
	rating = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.QuestionWithRating";
	}
}
export { QuestionWithRating }

class Answer extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#Answer';
	question = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.Answer";
	}
}
export { Answer }

class QuestionnaireAnswer extends Sort {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#QuestionnaireAnswer';
	questionAnswers = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.QuestionnaireAnswer";
	}
}
export { QuestionnaireAnswer }

class ChooseOneOptionQuestionAnswer extends Answer {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#ChooseOneOptionQuestionAnswer';
	solution = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.ChooseOneOptionQuestionAnswer";
	}
}
export { ChooseOneOptionQuestionAnswer }

class ChooseVariousOptionsQuestionAnswer extends Answer {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#ChooseVariousOptionsQuestionAnswer';
	solutions = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.ChooseVariousOptionsQuestionAnswer";
	}
}
export { ChooseVariousOptionsQuestionAnswer }

class InsertOneTextQuestionAnswer extends Answer {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#InsertOneTextQuestionAnswer';
	solution = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.InsertOneTextQuestionAnswer";
	}
}
export { InsertOneTextQuestionAnswer }

class InsertVariousTextsQuestionAnswer extends Answer {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#InsertVariousTextsQuestionAnswer';
	solutions = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.InsertVariousTextsQuestionAnswer";
	}
}
export { InsertVariousTextsQuestionAnswer }

class SimpleFillInTheBlanksQuestionAnswer extends Answer {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#SimpleFillInTheBlanksQuestionAnswer';
	solution = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.SimpleFillInTheBlanksQuestionAnswer";
	}
}
export { SimpleFillInTheBlanksQuestionAnswer }

class MultipleFillInTheBlanksQuestionAnswer extends Answer {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#MultipleFillInTheBlanksQuestionAnswer';
	solutions = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.MultipleFillInTheBlanksQuestionAnswer";
	}
}
export { MultipleFillInTheBlanksQuestionAnswer }

class TrueFalseQuestionAnswer extends Answer {
	static RDFS_CLASS = 'http://citius.usc.es/hmb/citius.owl#TrueFalseQuestionAnswer';
	solution = undefined

	constructor(options = {}) {
		super(options);
		this['@class'] = "es.usc.citius.hmb.games.TrueFalseQuestionAnswer";
	}
}
export { TrueFalseQuestionAnswer }