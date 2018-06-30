import { Dialog } from 'react-toolbox/lib/dialog'
import CSSModules from 'react-css-modules'
import CONFIG from '../../common/config.json'

import Chip from 'react-toolbox/lib/chip'
import styles from './styles.scss'
import Input from 'react-toolbox/lib/input';
import {Button, IconButton, BrowseButton} from 'react-toolbox/lib/button';
import React, {Component} from 'react'
import Checkbox from 'react-toolbox/lib/checkbox';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { autobind } from 'core-decorators'
import {
    Question, Tag, StringType, QuestionType, VideoQuestionType,
    PictureQuestionType, TrueFalseQuestionType, ChooseOneOptionQuestion, ChooseVariousOptionsQuestion,
    Option, TextSolution, QuestionWithRating,
    InsertOneTextQuestion, InsertVariousTextsQuestion, FillInTheBlanksQuestionType
} from "../../common/lib/model/questionnairesModel";
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import Dropdown from 'react-toolbox/lib/dropdown';
import {BooleanType, IntegerType} from "../../common/lib/model";
import Tooltip from "react-toolbox/lib/tooltip/index";
import ReactDOM from "react-dom";

const TooltipButton = Tooltip(IconButton)

const cardinality = [
    { value: 'simple', label: 'Simple' },
    { value: 'multiple', label: 'Multiple'},
];

const trueFalse = [
    { value: 'true', label: 'True' },
    { value: 'false', label: 'False'},
];

const settings = defineMessages({
    title: {
        id: 'app.settings.dialog.title',
        description: 'App configuration dialog title',
        defaultMessage: 'Settings',
    },
    cancel: {
        id: 'app.settings.dialog.actions.cancel',
        description: 'App configuration dialog cancel action',
        defaultMessage: 'Cancel',
    },
    save: {
        id: 'app.settings.dialog.actions.save',
        description: 'App configuration dialog save action',
        defaultMessage: 'Save',
    },
    edit: {
        id: 'app.settings.dialog.actions.edit',
        description: 'App configuration dialog edit action',
        defaultMessage: 'Edit',
    }
});

const languages = CONFIG.app.languages.available;
const langSelectorSource = [];
languages.map(({code, name, flag}) => langSelectorSource.push({label: name, value: code, flag: require(`../../common/img/${flag}`)}))
const messages = defineMessages({
    mandatory: {
        id: 'questionnaires.input.isMandatory',
        description : 'Message to show when a mandatory input is not fulfilled',
        defaultMessage: 'This input is mandatory'
    },
    maxSize:{
        id: 'questionnaires.input.maxSize',
        description : 'Message to show when the file is bigger than 10MB',
        defaultMessage: 'File size limit exceeded (10 MB)'
    },
    videoFormat:{
        id: 'questionnaires.input.videoFormat',
        description : 'Message to show when the video isnt an mp4',
        defaultMessage: 'The video has to be a mp4'
    },
    imageFormat:{
        id: 'questionnaires.input.imageFormat',
        description : 'Message to show when the file is not an image',
        defaultMessage: 'The current file isnt an image'
    },
    misformed: {
        id: 'questionnaires.input.misformed',
        description : 'Message to show when the sentence input is misformed',
        defaultMessage: 'The sentence is misformed'
    },
    positive: {
        id: 'questionnaires.input.positive',
        description : 'Message to show when the score input should be positive',
        defaultMessage: 'The score should be positive'
    },
    incorrect: {
        id: 'questionnaires.input.incorrect',
        description : 'Message to show when the score is incorrect',
        defaultMessage: 'The score is not a number'
    },
    negative: {
        id: 'questionnaires.input.negative',
        description : 'Message to show when the score input should be positive',
        defaultMessage: 'The score should be negative'
    },
    created: {
        id: 'questionnaires.input.isCreated',
        description : 'Message to show when a tag is already created',
        defaultMessage: 'This tag is already created'
    },
    numerical: {
        id: 'questionnaires.input.isNumerical',
        description : 'Message to show when a number input is is not numerical',
        defaultMessage: 'This input must be a number'
    }
});

@CSSModules(styles, {allowMultiple: true})
@autobind class QuestionDialog extends Component{

    constructor(props){
        super(props);

        this.state = {
            uri: '',
            statement: '',
            sentence: '',
            sentencePreview: '',
            tag: '',
            tags: [],
            video: null,
            picture: null,
            videoURL: '',
            pictureURL: '',
            showStatementMandatory: false,
            showSentenceMandatory: false,
            showSentenceMisformed: false,
            showVideoMandatory : false,
            showVideoFormatError: false,
            showVideoSizeError: false,
            showPictureMandatory: false,
            showPictureFormatError: false,
            showPictureSizeError: false,
            showScoreMandatory: false,
            showTagMandatory: false,
            showTagCreated: false,
            showTrueFalseScoreMandatory: false,
            showTrueFalseScoreIncorrect: false,
            showTextResponseError: [{
                textMandatory: false,
                numberMandatory: false,
                numberIncorrect: false,
            }],
            showFillInResponseError: {},
            showOptionResponseError: [{
                textMandatory: false,
                numberMandatory: false,
                numberIncorrect: false,
                numberPositive: false,
                numberNegative: false
            }],
            questionType: 'es.usc.citius.hmb.games.QuestionType',
            answerType: 'optionAnswer',
            cardinality: 'simple',
            trueFalseResponse: {
                value: 'true',
                score: 0
            },
            textResponse: [{
                text: '',
                score: 0
            }],
            fillInResponse: {},
            optionResponse: [{
                text: '',
                score: 0,
                selected: false
            }],
            optionSelected: 0,
            isRated: false,
            rate: '',
            isNew: true,
            opening: true,
        }
    }

    componentWillReceiveProps(props) {
        if (props.question !== null){
            let cardinality, answerType, options=[], trueFalseResponse= {value: 'true', score: 0};
            let textErrors = [], optionErrors = [], fillInResponses={}, fillInErrors = {};
            let textResponses= [], selectedOption = 0, sentence, sentencePreview;
            if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.ChooseOneOptionQuestion"){
                cardinality = 'simple';
                answerType = 'optionAnswer';
                options = props.question.answerType.options.map(
                    (option, idx) => {
                        optionErrors.push({
                            textMandatory: false, numberMandatory: false, numberIncorrect: false,
                            numberPositive: false, numberNegative: false
                        });
                        if(props.question.answerType.solution.uri === option.uri) selectedOption = idx;
                        return {text: option.text.stringValue, score: option.score.integerValue, selected: false}
                    }
                );
                textResponses.push({
                    text: '',
                    score: 0
                });
                textErrors.push({textMandatory: false, numberMandatory: false, numberIncorrect: false});
                fillInErrors = {};
                sentence='';
                sentencePreview = '';
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.ChooseVariousOptionsQuestion"){
                cardinality = 'multiple';
                answerType = 'optionAnswer';
                options = props.question.answerType.options.map(
                    (option) => {
                        let selected = props.question.answerType.solutions.find( ({uri}) =>  uri === option.uri ) !== undefined;
                        optionErrors.push({
                            textMandatory: false, numberMandatory: false, numberIncorrect: false,
                            numberPositive: false, numberNegative: false
                        });
                        return {text: option.text.stringValue, score: option.score.integerValue, selected: selected}
                    }
                );
                textResponses.push({
                    text: '',
                    score: 0
                });
                textErrors.push({textMandatory: false, numberMandatory: false,numberIncorrect: false});
                fillInErrors = {};
                sentence='';
                sentencePreview = '';
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.TrueFalseQuestionType"){
                cardinality = 'simple';
                answerType = 'trueFalseAnswer';
                trueFalseResponse.value = props.question.answerType.solution.booleanValue? "true" : "false";
                trueFalseResponse.score = props.question.answerType.score.integerValue;
                textResponses.push({
                    text: '',
                    score: 0
                });
                textErrors.push({textMandatory: false, numberMandatory: false,numberIncorrect: false});
                options.push({
                    text: '',
                    score: 0,
                    selected: false
                });
                optionErrors.push({
                    textMandatory: false, numberMandatory: false, numberIncorrect: false,
                    numberPositive: false, numberNegative: false
                });
                fillInErrors = {};
                sentence='';
                sentencePreview = '';
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.InsertOneTextQuestion"){
                cardinality = 'simple';
                answerType = 'textAnswer';
                textErrors.push({textMandatory: false, numberMandatory: false,numberIncorrect: false});
                textResponses.push({
                    text: props.question.answerType.solution.solution.stringValue,
                    score: props.question.answerType.solution.score.integerValue
                });
                options.push({
                    text: '',
                    score: 0,
                    selected: false
                });
                optionErrors.push({
                    textMandatory: false, numberMandatory: false, numberIncorrect: false,
                    numberPositive: false, numberNegative: false
                });
                fillInErrors = {};
                sentence='';
                sentencePreview = '';
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.InsertVariousTextsQuestion"){
                cardinality = 'multiple';
                answerType = 'textAnswer';
                props.question.answerType.solutions.map(
                    (solution) => {
                        textErrors.push({textMandatory: false, numberMandatory: false,numberIncorrect: false});
                        textResponses.push({
                            text: solution.solution.stringValue,
                            score: solution.score.integerValue
                        });
                    }
                );
                options.push({
                    text: '',
                    score: 0,
                    selected: false
                });
                optionErrors.push({
                    textMandatory: false, numberMandatory: false, numberIncorrect: false,
                    numberPositive: false, numberNegative: false
                });
                fillInErrors = {};
                sentence='';
                sentencePreview = '';
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.FillInTheBlanksQuestionType"){
                cardinality = 'multiple';
                answerType = 'fillInTheBlanksAnswer';
                sentence=props.question.answerType.sentence.stringValue;
                sentencePreview=props.question.answerType.sentence.stringValue.replace(/\[Blank\d\d\]/g, "____");
                props.question.answerType.solutions.map(
                    (solution, index) => {
                        let i = index;
                        if (i < 10) i = "0"+i;
                        fillInErrors["[Blank"+i+"]"] = {textMandatory: false, numberMandatory: false,numberIncorrect: false};
                        fillInResponses["[Blank"+i+"]"] = {
                            text: solution.solution.stringValue,
                            score: solution.score.integerValue
                        };
                    }
                );

                options.push({
                    text: '',
                    score: 0,
                    selected: false
                });
                optionErrors.push({
                    textMandatory: false, numberMandatory: false, numberIncorrect: false,
                    numberPositive: false, numberNegative: false
                });
                textResponses.push({
                    text: '',
                    score: 0
                });
                textErrors.push({textMandatory: false, numberMandatory: false,numberIncorrect: false});
            }

            this.setState({
                uri: props.question.uri,
                statement: props.question.statement.stringValue,
                sentence: sentence,
                sentencePreview: sentencePreview,
                tag: '',
                tags: props.question.tags.map((tag) => {return tag.value.stringValue}),
                videoURL: props.question.questionType["@class"] === 'es.usc.citius.hmb.games.VideoQuestionType'?
                    props.question.questionType.videoURL.stringValue : '',
                pictureURL: props.question.questionType["@class"] === 'es.usc.citius.hmb.games.PictureQuestionType'?
                    props.question.questionType.imageURL.stringValue : '',
                video: null,
                picture: null,
                showStatementMandatory: false,
                showSentenceMandatory: false,
                showSentenceMisformed: false,
                showScoreMandatory: false,
                showTagMandatory: false,
                showTagCreated: false,
                showVideoMandatory : false,
                showVideoFormatError: false,
                showVideoSizeError: false,
                showPictureMandatory: false,
                showPictureFormatError: false,
                showPictureSizeError: false,
                showTrueFalseScoreMandatory: false,
                showTrueFalseScoreIncorrect: false,
                showTextResponseError: textErrors,
                showFillInResponseError: fillInErrors,
                showOptionResponseError: optionErrors,
                questionType: props.question.questionType["@class"],
                answerType: answerType,
                cardinality: cardinality,
                trueFalseResponse: trueFalseResponse,
                textResponse: textResponses,
                fillInResponse: fillInResponses,
                optionResponse: options,
                optionSelected: selectedOption,
                isRated: props.question["@class"] === "es.usc.citius.hmb.games.QuestionWithRating",
                rate: props.question["@class"] === "es.usc.citius.hmb.games.QuestionWithRating"?
                    props.question.rating.integerValue : '',
                isNew: false,
                opening: false
            })
        } else if(props.question === null && this.state.opening){
            this.setState({
                statement: '',
                sentence: '',
                tag: '',
                tags: [],
                video: null,
                picture: null,
                videoURL: '',
                pictureURL: '',
                showStatementMandatory: false,
                showSentenceMandatory: false,
                showSentenceMisformed: false,
                showVideoMandatory : false,
                showVideoFormatError: false,
                showVideoSizeError: false,
                showPictureMandatory: false,
                showPictureFormatError: false,
                showPictureSizeError: false,
                showTagMandatory: false,
                showTagCreated: false,
                showScoreMandatory: false,
                showTrueFalseScoreMandatory: false,
                showTrueFalseScoreIncorrect: false,
                showTextResponseError: [{textMandatory: false, numberMandatory: false,numberIncorrect: false}],
                showFillInResponseError: {},
                showOptionResponseError: [{
                    textMandatory: false,
                    numberMandatory: false,
                    numberIncorrect: false,
                    numberPositive: false,
                    numberNegative: false
                }],
                questionType: 'es.usc.citius.hmb.games.QuestionType',
                answerType: 'optionAnswer',
                cardinality: 'simple',
                trueFalseResponse: {
                    value: 'true',
                    score: 0
                },
                textResponse: [{
                    text: '',
                    score: 0
                }],
                fillInResponse: {},
                optionResponse: [{
                    text: '',
                    score: 0,
                    selected: false
                }],
                optionSelected: 0,
                isRated: false,
                rate: '',
                isNew: true,
                opening: false
            })
        } else if(props.question === null && !this.state.opening){
            this.setState(prevState => ({
                ...prevState,
                opening: true
            }))
        }

    }

    handleQuestionTypeChange(value){
        this.setState(prevState => ({...prevState, questionType: value}))
    }

    handleAnswerTypeChange(value){
        this.setState(prevState => ({...prevState, answerType: value}))

    }

    handleTrueFalseResponseChange(value){
        this.setState(prevState => ({...prevState, trueFalseResponse: {... prevState.trueFalseResponse, value: value}}))

    }

    handleTrueFalseScoreChange(value){
        if(value === '' || !Number.isNaN(Number.parseInt(value)) && value >= 0) {
            this.setState(prevState => ({...prevState,
                trueFalseResponse: {... prevState.trueFalseResponse, score: value},
                showTrueFalseScoreMandatory: false,
                showTrueFalseScoreIncorrect: false
            }))
        }
    }

    handleCardinalityChange(value){
        this.setState(prevState => ({...prevState, cardinality: value}))

    }

    handleTagChange(selectedTag){
        this.setState(prevState => ({...prevState, tags: this.state.tags.filter(id => id !== selectedTag.id)}))
    }

    tagChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                tag: value,
                showTagMandatory: false,
                showTagCreated: false
            }
        });
    }

    statementChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                statement: value,
                showStatementMandatory: false
            }
        });
    }

    sentenceChange(value) {
        let blanks = (value.match(/\[Blank\d\d\]/g) || []);
        var preview = value.replace(/\[Blank\d\d\]/g, "____");
        let newFillInResponse = {};
        let newShowFillInResponseError = {};

        blanks.map(
            (blank) => {
                if(this.state.fillInResponse[blank]){
                    newFillInResponse[blank] = this.state.fillInResponse[blank]
                    newShowFillInResponseError[blank] = this.state.showFillInResponseError[blank]
                } else {
                    newFillInResponse[blank] = {
                        text: '',
                        score: 0
                    }
                    newShowFillInResponseError[blank] = {
                        textMandatory: false,
                        numberMandatory: false,
                        numberIncorrect: false
                    };

                }
            }
        )

        this.setState((previousState) => {
            return {
                ...previousState,
                sentence: value,
                sentencePreview: preview,
                fillInResponse: newFillInResponse,
                showFillInResponseError: newShowFillInResponseError,
                showSentenceMandatory: false,
                showSentenceMisformed: false
            }
        });
    }

    anyOptionInvalid(){
        for(let i = 0; i < this.state.optionResponse.length; i++){
            if(this.state.optionResponse[i].text.length === 0 ||
                this.state.optionResponse[i].score.length === 0 ||
                this.state.optionResponse[i].score[this.state.optionResponse[i].score.length - 1] === '.' ||
                this.state.optionResponse[i].score < 0 && this.state.optionResponse[i].selected && this.state.cardinality ==='multiple' ||
                this.state.optionResponse[i].score < 0 && this.state.optionSelected === i && this.state.cardinality ==='simple' ||
                this.state.optionResponse[i].score > 0 && !this.state.optionResponse[i].selected && this.state.cardinality ==='multiple' ||
                this.state.optionResponse[i].score > 0 && this.state.optionSelected !== i && this.state.cardinality ==='simple'){
                return true
            }
        }
        return false;
    }
    anyTextInvalid(){
        for(let i = 0; i < this.state.textResponse.length; i++){
            if(this.state.textResponse[i].text.length === 0 ||
                this.state.textResponse[i].score.length === 0 ||
                this.state.textResponse[i].score[this.state.textResponse[i].score.length - 1] === '.') return true
        }
        return false;
    }
    anyFillInvalid(){
        let keys = Object.keys(this.state.fillInResponse);
        for(let i = 0; i < keys.length; i++){
            if(this.state.fillInResponse[keys[i]].text.length === 0 ||
                this.state.fillInResponse[keys[i]].score.length === 0 ||
                this.state.fillInResponse[keys[i]].score[this.state.fillInResponse[keys[i]].score.length - 1] === '.')
                return true
        }
        return false;
    }

    sentenceInvalid(){
        let count = (this.state.sentence.match(/\[Blank\d\d\]/g) || []).length;
        return count !== Object.keys(this.state.fillInResponse).length || count === 0
    }

    isAnyOptionSelected(){
        for(let i = 0; i < this.state.optionResponse.length; i++){
            if(this.state.optionResponse[i].selected) return true
        }
        return false
    }

    handleSave(){
        let { onSave, onUpdate } = this.props;

        let question, file = null, options = { uri: this.state.uri };
        if(this.state.statement.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showStatementMandatory: true
                }
            });
        else if(this.state.questionType === 'es.usc.citius.hmb.games.VideoQuestionType' && this.state.videoURL === ''){
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showVideoMandatory: true,
                    showVideoFormatError : false,
                    showVideoSizeError: false,
                }
            });}
        else if(this.state.questionType === 'es.usc.citius.hmb.games.PictureQuestionType' && this.state.pictureURL === ''){
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showPictureMandatory: true,
                    showPictureFormatError: false,
                    showPictureSizeError: false,
                }
            });
        }

        else if(this.state.answerType === 'fillInTheBlanksAnswer' && this.state.sentence.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showSentenceMandatory: true
                }
            });
        else if(this.state.answerType === 'optionAnswer' && this.anyOptionInvalid()){
            const newOptionErrors = this.state.optionResponse.map((optionResponse, sidx) => {
                if (optionResponse.text.length === 0) {
                    return {
                        textMandatory: true,
                        numberMandatory: this.state.showOptionResponseError[sidx].numberMandatory,
                        numberIncorrect: this.state.showOptionResponseError[sidx].numberIncorrect,
                        numberPositive: this.state.showOptionResponseError[sidx].numberPositive,
                        numberNegative: this.state.showOptionResponseError[sidx].numberNegative
                    };
                } else if(optionResponse.score.length === 0){
                    return {
                        textMandatory: this.state.showOptionResponseError[sidx].textMandatory,
                        numberMandatory: true,
                        numberIncorrect: this.state.showOptionResponseError[sidx].numberIncorrect,
                        numberPositive: this.state.showOptionResponseError[sidx].numberPositive,
                        numberNegative: this.state.showOptionResponseError[sidx].numberNegative
                    };
                } else if (optionResponse.score[optionResponse.score.length - 1] === '.'){
                    return {
                        textMandatory: this.state.showOptionResponseError[sidx].textMandatory,
                        numberMandatory: this.state.showOptionResponseError[sidx].numberMandatory,
                        numberIncorrect: true,
                        numberPositive: this.state.showOptionResponseError[sidx].numberPositive,
                        numberNegative: this.state.showOptionResponseError[sidx].numberNegative
                    };
                } else if( (optionResponse.score < 0 && optionResponse.selected && this.state.cardinality ==='multiple') ||
                    ((optionResponse.score < 0 && this.state.optionSelected === sidx && this.state.cardinality ==='simple')) ){
                    return {
                        textMandatory: this.state.showOptionResponseError[sidx].textMandatory,
                        numberMandatory: this.state.showOptionResponseError[sidx].numberMandatory,
                        numberIncorrect: this.state.showOptionResponseError[sidx].numberIncorrect,
                        numberPositive: true,
                        numberNegative: this.state.showOptionResponseError[sidx].numberNegative
                    };
                } else if( (optionResponse.score > 0 && !optionResponse.selected  && this.state.cardinality ==='multiple') ||
                    (optionResponse.score > 0 && this.state.optionSelected !== sidx  && this.state.cardinality ==='simple') ){
                    return {
                        textMandatory: this.state.showOptionResponseError[sidx].textMandatory,
                        numberMandatory: this.state.showOptionResponseError[sidx].numberMandatory,
                        numberIncorrect: this.state.showOptionResponseError[sidx].numberIncorrect,
                        numberPositive: this.state.showOptionResponseError[sidx].numberPositive,
                        numberNegative: true
                    };
                }
                return this.state.showOptionResponseError[sidx];
            });

            this.setState((previousState) => {
                return {
                    ...previousState,
                    showOptionResponseError: newOptionErrors
                }
            });

        } else if(this.state.answerType === 'textAnswer' && this.anyTextInvalid()){
            const newTextErrors = this.state.textResponse.map((textResponse, sidx) => {
                if (textResponse.text.length === 0) {
                    return {textMandatory: true, numberIncorrect: this.state.showTextResponseError[sidx].numberIncorrect,
                        numberMandatory: this.state.showTextResponseError[sidx].numberMandatory};
                } else if(textResponse.score.length === 0){
                    return {textMandatory: this.state.showTextResponseError[sidx].textMandatory,
                        numberIncorrect: this.state.showTextResponseError[sidx].numberIncorrect, numberMandatory: true};
                } else if(textResponse.score[textResponse.score.length - 1] === '.'){
                    return {textMandatory: this.state.showTextResponseError[sidx].textMandatory,
                        numberIncorrect: true, numberMandatory: this.state.showTextResponseError[sidx].numberMandatory};
                }
                return this.state.showTextResponseError[sidx];
            });

            this.setState((previousState) => {
                return {
                    ...previousState,
                    showTextResponseError: newTextErrors
                }
            });
        } else if(this.state.answerType === 'fillInTheBlanksAnswer' && this.sentenceInvalid()) {
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showSentenceMisformed: true
                }
            });
        } else if(this.state.answerType === 'fillInTheBlanksAnswer' && this.anyFillInvalid()){
            let newFillInErrors = {};
            Object.keys(this.state.fillInResponse).map((fillInResponse) => {
                if (this.state.fillInResponse[fillInResponse].text.length === 0) {
                    newFillInErrors[fillInResponse] = {textMandatory: true, numberMandatory: this.state.showFillInResponseError[fillInResponse].numberMandatory,
                        numberIncorrect: this.state.showFillInResponseError[fillInResponse].numberIncorrect};
                } else if(this.state.fillInResponse[fillInResponse].score.length === 0){
                    newFillInErrors[fillInResponse] = {textMandatory: this.state.showFillInResponseError[fillInResponse].textMandatory,
                        numberMandatory: true, numberIncorrect: this.state.showFillInResponseError[fillInResponse].numberIncorrect};
                } else if(this.state.fillInResponse[fillInResponse].score[this.state.fillInResponse[fillInResponse].score.length -1] === '.'){
                    newFillInErrors[fillInResponse] = {textMandatory: this.state.showFillInResponseError[fillInResponse].textMandatory,
                        numberMandatory: this.state.showFillInResponseError[fillInResponse].numberMandatory,numberIncorrect: true};
                } else{
                    newFillInErrors[fillInResponse] = this.state.showFillInResponseError[fillInResponse];
                }
            });

            this.setState((previousState) => {
                return {
                    ...previousState,
                    showFillInResponseError: newFillInErrors
                }
            });
        }
        else if(this.state.trueFalseResponse.score.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showTrueFalseScoreMandatory: true
                }
            });
        else if(this.state.trueFalseResponse.score[this.state.trueFalseResponse.score.length - 1] === '.')
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showTrueFalseScoreIncorrect: true
                }
            });
        else if(this.state.isRated && this.state.rate.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showScoreMandatory: true
                }
            });
        else if(this.state.answerType === 'optionAnswer' && this.state.cardinality === 'multiple' && !this.isAnyOptionSelected())
            alert("Choose at least one Option");
        else{
            if(this.state.isRated){
                if(this.state.isNew){
                    question = new QuestionWithRating();
                    question.genURI();
                } else {
                    question = new QuestionWithRating(options);
                }
                question.rating = new IntegerType();
                question.rating.genURI();
                question.rating.integerValue = this.state.rate;
            } else{
                if(this.state.isNew){
                    question = new Question();
                    question.genURI();
                } else {
                    question = new Question(options);
                }

            }

            question.tags = [];
            this.state.tags.map(
                (tag) => {
                    let TAG = new Tag();
                    TAG.genURI();
                    TAG.value = new StringType();
                    TAG.value.genURI();
                    TAG.value.stringValue = tag;
                    question.tags.push(TAG)
                }
            );

            question.statement = new StringType();
            question.statement.genURI();
            question.statement.stringValue = this.state.statement;
            if(this.state.questionType === 'es.usc.citius.hmb.games.QuestionType'){
                question.questionType = new QuestionType();
                question.questionType.genURI();
            } else if(this.state.questionType === 'es.usc.citius.hmb.games.VideoQuestionType'){
                question.questionType = new VideoQuestionType();
                question.questionType.genURI();
                question.questionType.videoURL = new StringType();
                file = this.state.video
                //question.questionType.videoURL.stringValue = this.state.videoURL
            } else if(this.state.questionType === 'es.usc.citius.hmb.games.PictureQuestionType'){
                question.questionType = new PictureQuestionType();
                question.questionType.genURI();
                question.questionType.imageURL = new StringType();
                file = this.state.picture
                //question.questionType.imageURL.stringValue = this.state.pictureURL
            }

            if(this.state.answerType === 'optionAnswer' && this.state.cardinality === 'simple'){
                question.answerType = new ChooseOneOptionQuestion();
                question.answerType.genURI();
                question.answerType.options = [];
                for(let i = 0; i < this.state.optionResponse.length; i++ ){
                    let option = new Option();
                    option.text = new StringType();
                    option.score = new IntegerType();
                    option.genURI();
                    option.text.genURI();
                    option.text.stringValue = this.state.optionResponse[i].text;
                    option.score.genURI();
                    option.score.integerValue = this.state.optionResponse[i].score;

                    if(i === this.state.optionSelected) question.answerType.solution = option;
                    question.answerType.options.push(option)
                }

            } else if(this.state.answerType === 'optionAnswer' && this.state.cardinality === 'multiple'){
                question.answerType = new ChooseVariousOptionsQuestion();
                question.answerType.genURI();
                question.answerType.options = [];
                question.answerType.solutions = [];
                for(let i = 0; i < this.state.optionResponse.length; i++ ){
                    let option = new Option();
                    option.text = new StringType();
                    option.score = new IntegerType();
                    option.genURI();
                    option.text.genURI();
                    option.text.stringValue = this.state.optionResponse[i].text;
                    option.score.genURI();
                    option.score.integerValue = this.state.optionResponse[i].score;

                    if(this.state.optionResponse[i].selected) question.answerType.solutions.push(option);
                    question.answerType.options.push(option)
                }

            } else if(this.state.answerType === 'textAnswer' && this.state.cardinality === 'simple'){
                question.answerType = new InsertOneTextQuestion();
                question.answerType.genURI();
                question.answerType.solution = new TextSolution();
                question.answerType.solution.genURI();
                question.answerType.solution.solution = new StringType();
                question.answerType.solution.solution.genURI();
                question.answerType.solution.solution.stringValue = this.state.textResponse[0].text;
                question.answerType.solution.score = new IntegerType();
                question.answerType.solution.score.genURI();
                question.answerType.solution.score.integerValue = this.state.textResponse[0].score;

            } else if(this.state.answerType === 'textAnswer' && this.state.cardinality === 'multiple'){
                question.answerType = new InsertVariousTextsQuestion();
                question.answerType.genURI();
                question.answerType.solutions = [];
                for(let i = 0; i < this.state.textResponse.length; i++ ){
                    let solution = new TextSolution();
                    solution.solution = new StringType();
                    solution.score = new IntegerType();
                    solution.genURI();
                    solution.solution.genURI();
                    solution.solution.stringValue = this.state.textResponse[i].text;
                    solution.score.genURI();
                    solution.score.integerValue = this.state.textResponse[i].score;

                    question.answerType.solutions.push(solution)
                }

            } else if(this.state.answerType === 'fillInTheBlanksAnswer'){
                question.answerType = new FillInTheBlanksQuestionType();
                question.answerType.genURI();
                question.answerType.sentence = new StringType();
                question.answerType.sentence.genURI();
                question.answerType.sentence.stringValue = this.state.sentence;
                question.answerType.solutions = [];
                Object.keys(this.state.fillInResponse).map(
                    (blank) => {
                        let solution = new TextSolution();
                        solution.solution = new StringType();
                        solution.score = new IntegerType();
                        solution.genURI();
                        solution.solution.genURI();
                        solution.solution.stringValue = this.state.fillInResponse[blank].text;
                        solution.score.genURI();
                        solution.score.integerValue = this.state.fillInResponse[blank].score;
                        question.answerType.solutions.push(solution)
                    }
                )
            } else if(this.state.answerType === 'trueFalseAnswer'){
                question.answerType = new TrueFalseQuestionType();
                question.answerType.genURI();
                question.answerType.solution = new BooleanType();
                question.answerType.solution.genURI();
                question.answerType.solution.booleanValue = this.state.trueFalseResponse.value;
                question.answerType.score = new IntegerType();
                question.answerType.score.genURI();
                question.answerType.score.integerValue = this.state.trueFalseResponse.score;

            }

            let form = document.createElement('form');
            form.enctype = "multipart/form-data";
            let fd = new FormData(form);
            fd.append('question', JSON.stringify(question));
            if(file !== null)
                fd.append('file', file);

            if(this.state.isNew) onSave(fd);
            else onUpdate(fd, question.uri)
        }
    }

    addTag() {
        if(this.state.tag.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showTagMandatory: true
                }
            });
        else{
            if(this.state.tags.find(tag => tag === this.state.tag) === undefined){
                this.setState(prevState => ({...prevState, tag: '', tags: [...prevState.tags, this.state.tag]}))
            } else {
                this.setState((previousState) => {
                    return {
                        ...previousState,
                        showTagCreated: true
                    }
                });
            }
        }

    }

    videoChange(e){
        const file = e.target.files[0];
        if(!file.type.includes("video/mp4")){
            this.setState(prevState => ({...prevState,
                showVideoFormatError: true,
                showVideoSizeError: false,
                showVideoMandatory: false
            }))
        } else if(file.size > 10000000){
            this.setState(prevState => ({...prevState,
                showVideoFormatError: false,
                showVideoSizeError: true,
                showVideoMandatory: false
            }))
        } else{
            this.setState(prevState => ({...prevState, video: file,
                videoURL: URL.createObjectURL(file),
                showVideoFormatError: false,
                showVideoSizeError: false,
                showVideoMandatory: false
            }), () =>{
                let $source = ReactDOM.findDOMNode(this.__video);
                $source.src = this.state.videoURL;
                $source.parentNode.load();
            })
        }

    }

    pictureChange(e){
        const file = e.target.files[0];
        if(!file.type.includes("image/")){
            this.setState(prevState => ({...prevState,
                showPictureFormatError: true,
                showPictureSizeError: false,
                showPictureMandatory: false
            }))
        } else if(file.size > 10000000){
            this.setState(prevState => ({...prevState,
                showPictureFormatError: false,
                showPictureSizeError: true,
                showPictureMandatory: false
            }))
        } else{
            this.setState(prevState => ({...prevState, picture: file,
                pictureURL: URL.createObjectURL(file),
                showPictureMandatory: false}), () => {
                let $source = ReactDOM.findDOMNode(this.__picture);
                $source.src = this.state.pictureURL;
            })
        }
    }

    renderQuestionType(){
        let { intl: {formatMessage} } = this.props;

        switch(this.state.questionType){
            case 'es.usc.citius.hmb.games.VideoQuestionType':
                return (<div styleName="multimedia">
                    <video width="320" height="240" controls>
                        <source src={this.state.videoURL} type="video/mp4" ref = { element => this.__video = element }/>
                    </video>
                    <div>
                        <p>{
                            this.state.showVideoMandatory && formatMessage(messages.mandatory) ||
                            this.state.showVideoFormatError && formatMessage(messages.videoFormat) ||
                            this.state.showVideoSizeError && formatMessage(messages.maxSize) ||
                            this.state.videoURL === '' && "No video selected" || ''
                        }</p>
                        <BrowseButton
                            icon="file_upload"
                            label="Upload"
                            onChange={this.videoChange}
                            raised
                            accent
                        />
                    </div>
                </div>);
            case 'es.usc.citius.hmb.games.PictureQuestionType':
                return (<div styleName="multimedia">
                    <img height="240" src={this.state.pictureURL} ref = { element => this.__picture = element }/>
                    <div>
                        <p>{
                            this.state.showPictureMandatory && formatMessage(messages.mandatory) ||
                            this.state.showPictureFormatError && formatMessage(messages.imageFormat) ||
                            this.state.showPictureSizeError && formatMessage(messages.maxSize) ||
                            this.state.pictureURL === '' && "No image selected" || ''
                        }</p>
                        <BrowseButton
                            icon="file_upload"
                            label="Upload"
                            onChange={this.pictureChange}
                            raised
                            accent
                        />
                    </div>
                </div>);
            default:
        }
    }

    textResponseChange(idx, value) {
        let newTextErrors = [];
        const newTextResponse = this.state.textResponse.map((textResponse, sidx) => {
            if (idx !== sidx) {
                newTextErrors.push(this.state.showTextResponseError[sidx]);
                return textResponse;
            }
            newTextErrors.push({textMandatory: false, numberMandatory: false, numberIncorrect: false});
            return { ...textResponse, text: value };
        });

        this.setState(prevState => ({
            ...prevState,
            textResponse: newTextResponse,
            showTextResponseError: newTextErrors
        }));
    }

    fillInResponseChange(idx, value) {
        let newFillInErrors = JSON.parse(JSON.stringify(this.state.showFillInResponseError));
        let newFillInResponse = JSON.parse(JSON.stringify(this.state.fillInResponse));

        newFillInResponse[idx].text = value;
        newFillInErrors[idx] = {textMandatory: false, numberMandatory: false, numberIncorrect: false}

        this.setState(prevState => ({
            ...prevState,
            fillInResponse: newFillInResponse,
            showFillInResponseError: newFillInErrors
        }));
    }

    fillInScoreChange(idx, value) {
        if(value === '' || !Number.isNaN(Number.parseInt(value)) && value >= 0) {
            let newFillInErrors = JSON.parse(JSON.stringify(this.state.showFillInResponseError));
            let newFillInResponse = JSON.parse(JSON.stringify(this.state.fillInResponse));

            newFillInResponse[idx].score = value;
            newFillInErrors[idx] = {textMandatory: false, numberMandatory: false, numberIncorrect: false}

            this.setState(prevState => ({
                ...prevState,
                fillInResponse: newFillInResponse,
                showFillInResponseError: newFillInErrors
            }));
        }

    }

    textScoreChange(idx, value) {
        if(value === '' || !Number.isNaN(Number.parseInt(value)) && value >= 0) {
            let newTextErrors = [];
            const newTextResponse = this.state.textResponse.map((textResponse, sidx) => {
                if (idx !== sidx) {
                    newTextErrors.push(this.state.showTextResponseError[sidx]);
                    return textResponse;
                }
                newTextErrors.push({textMandatory: false, numberMandatory: false, numberIncorrect: false});
                return { ...textResponse, score: value };
            });

            this.setState(prevState => ({
                ...prevState,
                textResponse: newTextResponse,
                showTextResponseError: newTextErrors
            }));
        }

    }

    deleteTextResponse(idx, value){
        let newErrors = [];
        const newTextResponse = this.state.textResponse.map((textResponse, sidx) => {
            newErrors.push(this.state.showTextResponseError[sidx]);
            return textResponse;
        });
        newTextResponse.splice(idx, 1);
        newErrors.splice(idx, 1);

        this.setState(prevState => ({ ...prevState, textResponse: newTextResponse, showTextResponseError: newErrors }));
    }

    optionResponseChange(idx, value) {
        let newOptionErrors = [];
        const newOptionResponse = this.state.optionResponse.map((optionResponse, sidx) => {
            if (idx !== sidx) {
                newOptionErrors.push(this.state.showOptionResponseError[sidx]);
                return optionResponse;
            }
            newOptionErrors.push({textMandatory: false, numberMandatory: false, numberIncorrect: false});
            return { ...optionResponse, text: value };
        });

        this.setState(prevState => ({
            ...prevState,
            optionResponse: newOptionResponse,
            showOptionResponseError: newOptionErrors
        }));
    }

    optionScoreChange(idx, value) {
        let regex = /^[\+\-]?\d*\.?(\d+)?$/;
        if(value === '-' || value === '' || regex.test(value)) {
            let newOptionErrors = [];
            const newOptionResponse = this.state.optionResponse.map((optionResponse, sidx) => {
                if (idx !== sidx) {
                    newOptionErrors.push(this.state.showOptionResponseError[sidx]);
                    return optionResponse;
                }
                newOptionErrors.push({textMandatory: false, numberMandatory: false, numberIncorrect: false});
                return { ...optionResponse, score: value };
            });

            this.setState(prevState => ({
                ...prevState,
                optionResponse: newOptionResponse,
                showOptionResponseError: newOptionErrors
            }));
        }
    }

    optionSelectedChange(idx, value){
        const newOptionErrors = this.state.showOptionResponseError.map((option, sidx) => {
            return { ...option, numberPositive: false, numberNegative: false };
        });
        this.setState(prevState => ({ ...prevState, optionSelected: idx, showOptionResponseError: newOptionErrors }));
    }

    deleteOptionResponse(idx, value){
        if(this.state.cardinality === 'simple' && idx === this.state.optionSelected ||
            this.state.cardinality === 'multiple' && this.state.optionResponse[idx].selected){
            alert("Cant delete a selected option")
        } else {
            let newErrors = [];
            const newOptionResponse = this.state.optionResponse.map((optionResponse, sidx) => {
                newErrors.push(this.state.showOptionResponseError[sidx]);
                return optionResponse;
            });
            newOptionResponse.splice(idx, 1);
            newErrors.splice(idx, 1);

            if(idx < this.state.optionSelected)
                this.setState(prevState => ({ ...prevState, optionResponse: newOptionResponse, showOptionResponseError: newErrors, optionSelected: this.state.optionSelected - 1 }));
            else
                this.setState(prevState => ({ ...prevState, optionResponse: newOptionResponse, showOptionResponseError: newErrors }));
        }
    }

    optionCheckedChange(idx, value){
        let newOptionErrors = [...this.state.showOptionResponseError]
        const newOptionResponse = this.state.optionResponse.map((optionResponse, sidx) => {
            if (idx !== sidx) return optionResponse;
            newOptionErrors.numberNegative = false;
            newOptionErrors.numberPositive = false;
            newOptionErrors.numberIncorrect = false;
            return { ...optionResponse, selected: !optionResponse.selected };
        });
        this.setState(prevState => ({ ...prevState, optionResponse: newOptionResponse, showOptionResponseError: newOptionErrors }));
    }

    addTextResponse() {
        let responseErrors= [];
        const newTextResponse = this.state.textResponse.map((textResponse, sidx) => {
            responseErrors.push(this.state.showTextResponseError[sidx]);
            return textResponse;
        });
        newTextResponse.push({text: '', score: 0});
        responseErrors.push({textMandatory: false, numberMandatory: false, numberIncorrect: false});

        this.setState(prevState => ({ ...prevState, textResponse: newTextResponse, showTextResponseError: responseErrors }));
    }

    addOptionResponse() {
        let responseErrors= [];
        const newOptionResponse = this.state.optionResponse.map((optionResponse, sidx) => {
            responseErrors.push(this.state.showOptionResponseError[sidx]);
            return optionResponse;
        });
        newOptionResponse.push({text: '', score: 0});
        responseErrors.push({textMandatory: false, numberMandatory: false, numberIncorrect: false});

        this.setState(prevState => ({ ...prevState, optionResponse: newOptionResponse, showOptionResponseError: responseErrors }));
    }

    rateCheckedChange(value){
        this.setState(prevState => ({ ...prevState, isRated: value }));
    }

    rateChange(value){
        if(value === '' || !Number.isNaN(Number.parseInt(value)) && value >= 0){
            this.setState(prevState => ({ ...prevState, rate: value,showScoreMandatory: false }));
        }
    }

    renderTextActions(){
        switch(this.state.cardinality){
            case 'multiple':
                return <div styleName="center">
                    <Button
                        key={`Shareholderbutton`}
                        icon='add'
                        floating accent mini
                        className={styles['button2']}
                        onClick={this.addTextResponse}
                    />
                </div>
            case 'simple':
            default:
        }
    }

    renderTextCase(){
        let { intl: {formatMessage} } = this.props;

        switch(this.state.cardinality){
            case 'simple':
                return (
                    <div className={styles['textSolutions']}>
                        <Input type='text'
                               label='Text Response'
                               styleName = 'text'
                               value={this.state.textResponse[0].text}
                               error = { this.state.showTextResponseError[0].textMandatory && formatMessage(messages.mandatory) || ''}
                               onChange = { (value) => this.textResponseChange(0, value) }
                        />
                        <Input type='text'
                               styleName = 'number'
                               label='Score'
                               value={this.state.textResponse[0].score}
                               error = {
                                   this.state.showTextResponseError[0].numberMandatory && formatMessage(messages.mandatory) ||
                                   this.state.showTextResponseError[0].numberIncorrect && formatMessage(messages.incorrect) ||''}
                               onChange = { (value) => this.textScoreChange(0, value) }
                        />
                    </div>
                )
            case 'multiple':
                return this.state.textResponse.map((textResponse, idx) => (
                    <div styleName="center"
                         key={`Shareholder #${idx + 1} center`}
                    >
                        <div className={styles['textSolutions']}
                             key={`Shareholder #${idx + 1} textSolution`}
                        >
                            <Input type='text'
                                   label='Text Response'
                                   styleName = 'text'
                                   key={`Shareholder #${idx + 1} name`}
                                   value={textResponse.text}
                                   error = { this.state.showTextResponseError[idx].textMandatory && formatMessage(messages.mandatory) || ''}
                                   onChange = { (value) => this.textResponseChange(idx, value) }
                            />
                            <Input type='text'
                                   styleName = 'number'
                                   label='Score'
                                   key={`Shareholder #${idx + 1} score`}

                                   value={textResponse.score}
                                   error = {
                                       this.state.showTextResponseError[idx].numberMandatory && formatMessage(messages.mandatory) ||
                                       this.state.showTextResponseError[idx].numberIncorrect && formatMessage(messages.incorrect) ||''}
                                   onChange = { (value) => this.textScoreChange(idx, value) }
                            />
                            <Button
                                key={`Shareholder #${idx + 1} delete`}
                                icon='delete'
                                floating accent mini
                                className={styles['buttonDelete']}
                                disabled={this.state.textResponse.length === 1}
                                onClick = { (value) => this.deleteTextResponse(idx, value) }
                            />
                        </div>
                    </div>
                ))
            default:
        }
    }

    renderFillInTheBlanksCase(){
        let { intl: {formatMessage} } = this.props;

        return Object.keys(this.state.fillInResponse).map((blank) => (
            <div styleName="center"
                 key={`Shareholder #${blank + 1} center`}
            >
                <div className={styles['textSolutions']}
                     key={`Shareholder #${blank + 1} textSolution`}
                >
                    <p styleName="blank">{blank.substring(1, blank.length - 1)}: </p>
                    <Input type='text'
                           label='Fill In The Blanks Response'
                           styleName = 'text'
                           key={`Shareholder #${blank + 1} name`}
                           value={this.state.fillInResponse[blank].text}
                           error = { this.state.showFillInResponseError[blank].textMandatory && formatMessage(messages.mandatory) || ''}
                           onChange = { (value) => this.fillInResponseChange(blank, value) }
                    />
                    <Input type='text'
                           styleName = 'number'
                           label='Score'
                           key={`Shareholder #${blank + 1} score`}
                           value={this.state.fillInResponse[blank].score}
                           error = {
                               this.state.showFillInResponseError[blank].numberMandatory && formatMessage(messages.mandatory) ||
                               this.state.showFillInResponseError[blank].numberIncorrect && formatMessage(messages.incorrect) ||''}
                           onChange = { (value) => this.fillInScoreChange(blank, value) }
                    />
                </div>
            </div>
        ))
    }

    renderOptionActions(){
        return <div styleName="center">
            <Button
                key={`Shareholderbutton`}
                icon='add'
                floating accent mini
                className={styles['button2']}
                onClick={this.addOptionResponse}
            />
        </div>
    }

    renderOptionCase(){
        let { intl: {formatMessage} } = this.props;

        switch(this.state.cardinality){
            case 'simple':
                return this.state.optionResponse.map((optionResponse, idx) => (
                    <div styleName="center"
                         key={`Shareholder #${idx + 1} center`}
                    >
                        <div className={styles['textSolutions']}
                             key={`Shareholder #${idx + 1} textSolution`}
                        >
                            <RadioButton styleName="radioBtn"
                                         key={`Shareholder #${idx + 1} radio`}
                                         checked= { this.state.optionSelected === idx}
                                         onChange = { (value) => this.optionSelectedChange(idx, value) }
                            />
                            <Input type='text'
                                   label='Option Response'
                                   styleName = 'text'
                                   key={`Shareholder #${idx + 1} name`}
                                   value={optionResponse.text}
                                   error = { this.state.showOptionResponseError[idx].textMandatory && formatMessage(messages.mandatory) || ''}
                                   onChange = { (value) => this.optionResponseChange(idx, value) }
                            />
                            <Input type='text'
                                   styleName = 'number'
                                   label='Score'
                                   key={`Shareholder #${idx + 1} score`}
                                   value={optionResponse.score}
                                   error = {
                                       this.state.showOptionResponseError[idx].numberMandatory && formatMessage(messages.mandatory) ||
                                       this.state.showOptionResponseError[idx].numberNegative && formatMessage(messages.negative)||
                                       this.state.showOptionResponseError[idx].numberPositive && formatMessage(messages.positive) ||
                                       this.state.showOptionResponseError[idx].numberIncorrect && formatMessage(messages.incorrect) ||''
                                   }
                                   onChange = { (value) => this.optionScoreChange(idx, value) }
                            />
                            <Button
                                key={`Shareholder #${idx + 1} delete`}
                                icon='delete'
                                floating accent mini
                                className={styles['buttonDelete']}
                                disabled={this.state.optionResponse.length === 1}
                                onClick = { (value) => this.deleteOptionResponse(idx, value) }
                            />
                        </div>
                    </div>
                ))
            case 'multiple':
                return this.state.optionResponse.map((optionResponse, idx) => (
                    <div styleName="center"
                         key={`Shareholder #${idx + 1} center`}
                    >
                        <div className={styles['textSolutions']}
                             key={`Shareholder #${idx + 1} textSolution`}
                        >
                            <Checkbox styleName="radioBtn"
                                         key={`Shareholder #${idx + 1} check`}
                                         checked= { optionResponse.selected }
                                         onChange = { (value) => this.optionCheckedChange(idx, value) }
                            />
                            <Input type='text'
                                   label='Option Response'
                                   styleName = 'text'
                                   key={`Shareholder #${idx + 1} name`}
                                   value={optionResponse.text}
                                   error = { this.state.showOptionResponseError[idx].textMandatory && formatMessage(messages.mandatory) || ''}
                                   onChange = { (value) => this.optionResponseChange(idx, value) }
                            />
                            <Input type='text'
                                   styleName = 'number'
                                   label='Score'
                                   key={`Shareholder #${idx + 1} score`}
                                   value={optionResponse.score}
                                   error = {
                                       this.state.showOptionResponseError[idx].numberMandatory && formatMessage(messages.mandatory) ||
                                       this.state.showOptionResponseError[idx].numberNegative && formatMessage(messages.negative)||
                                       this.state.showOptionResponseError[idx].numberPositive && formatMessage(messages.positive) ||
                                       this.state.showOptionResponseError[idx].numberIncorrect && formatMessage(messages.incorrect) ||''
                                   }
                                   onChange = { (value) => this.optionScoreChange(idx, value) }
                            />
                            <Button
                                key={`Shareholder #${idx + 1} delete`}
                                icon='delete'
                                floating accent mini
                                className={styles['buttonDelete']}
                                disabled={this.state.optionResponse.length === 1}
                                onClick = { (value) => this.deleteOptionResponse(idx, value) }
                            />
                        </div>
                    </div>
                ))
            default:
        }
    }

    addBlankSpace(){
        let blanks = (this.state.sentence.match(/\[Blank\d\d\]/g) || []);
        for(let i = 0; i < 100; i++){
            let index = '';
            if (i < 10) index += "0" + i
            else index += i;
            if(!blanks.includes("[Blank"+index+"]")){
                let sentence = this.state.sentence+" [Blank"+index+"]";
                let preview = sentence.replace(/\[Blank\d\d\]/g, "____");

                this.setState(prevState => ({
                    ...prevState,
                    sentence: sentence,
                    sentencePreview: preview,
                    fillInResponse: {...prevState.fillInResponse, ["[Blank"+index+"]"]: {
                            text: '',
                            score: 0
                        }},
                    showFillInResponseError: {...prevState.showFillInResponseError, ["[Blank"+index+"]"]: {
                            textMandatory: false,
                            numberMandatory: false,
                            numberIncorrect: false}}
                }));
                break;
            }
        }
    }

    renderAnswerType(){
        let { intl: {formatMessage} } = this.props;

        switch(this.state.answerType){
            case 'optionAnswer':
                return  <div>
                    <Dropdown
                        auto
                        label="Cardinality"
                        onChange={this.handleCardinalityChange}
                        source={cardinality}
                        value={this.state.cardinality}
                    />
                    { this.renderOptionCase() }
                    { this.renderOptionActions() }
                </div>
            case 'textAnswer':
                return (
                    <div>
                        <Dropdown
                            auto
                            onChange={this.handleCardinalityChange}
                            source={cardinality}
                            value={this.state.cardinality}
                        />
                        { this.renderTextCase() }
                        { this.renderTextActions() }
                    </div>)
            case 'fillInTheBlanksAnswer':
                return (
                    <div>
                        <div styleName="sentence">
                            <Input type='text'
                                   styleName='sentenceInput'
                                   label='Sentence'
                                   hint="You need at least one blank space like this: [BlankXX] (with X between 0-9)"
                                   value={this.state.sentence}
                                   error = { this.state.showSentenceMandatory && formatMessage(messages.mandatory) || this.state.showSentenceMisformed && formatMessage(messages.misformed) || ''}
                                   onChange = { this.sentenceChange }
                                   multiline
                            />
                            <TooltipButton
                                styleName="sentenceButton"
                                icon='add_circle'
                                tooltip='Add a new blank space'
                                onClick={ this.addBlankSpace }
                                accent
                            />
                        </div>
                        <Input type='text'
                               label='Sentence Preview'
                               value={this.state.sentencePreview}
                               disabled={true}
                               styleName="preview"
                               multiline
                        />
                        { this.renderFillInTheBlanksCase() }
                    </div>);
            case 'trueFalseAnswer':
                return <div className={styles['trueFalseSolutions']}>
                    <Dropdown
                        auto
                        onChange={this.handleTrueFalseResponseChange}
                        source={trueFalse}
                        value={this.state.trueFalseResponse.value}
                    />
                    <Input type='text'
                           styleName = 'number'
                           label='Score'
                           value={this.state.trueFalseResponse.score}
                           error = {
                               this.state.showTrueFalseScoreMandatory && formatMessage(messages.mandatory) ||
                               this.state.showTrueFalseScoreIncorrect && formatMessage(messages.incorrect) || ''}
                           onChange = { this.handleTrueFalseScoreChange }
                    />
                </div>;
            default:
        }
    }

    handleOverlayClick(){
        let { onCancel} = this.props;

        let r = confirm("You will lose all unsaved progress. Are you sure you want to quit?");
        if (r === true) {
            onCancel()
        }
    }

    render(){

    let { active, onCancel, intl: {formatMessage} } = this.props;

    return <Dialog
        styleName="dialog"
            active={active}
            actions={[
                { label: "Cancel", onClick: onCancel },
                { label: 'Save', onClick: this.handleSave }
            ]}
            onEscKeyDown={onCancel}
            onOverlayClick={this.handleOverlayClick}
            title={ this.state.isNew? 'Add New Question' : 'Edit Question' }
        >
            <form>
                <div styleName="columns">
                    <Input type='text'
                           label='Question Statement'
                           styleName="statement"
                           value={this.state.statement}
                           error = { this.state.showStatementMandatory && formatMessage(messages.mandatory) || ''}
                           onChange = { this.statementChange }
                    />
                    <Checkbox
                        checked= { this.state.isRated }
                        styleName = "checkbox"
                        onChange = { this.rateCheckedChange }
                    />
                    <Input type="text"
                           disabled={!this.state.isRated}
                           value={ this.state.rate }
                           label= "Set Score"
                           error = { this.state.showScoreMandatory && formatMessage(messages.mandatory) || ''}
                           onChange={ this.rateChange }
                    />
                </div>


                <section className = { styles['multiSelector'] } >
                    <h1>
                        <FormattedMessage
                            id = 'games.editor.taskDialog.form.inputs.labels.questionType'
                            defaultMessage = 'Question Type'
                            description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Question Type'
                        />
                    </h1>
                    <RadioGroup  className={styles['radioGrp']} name='questionType' value={this.state.questionType} onChange={this.handleQuestionTypeChange}>
                        <RadioButton label='Simple Question' value='es.usc.citius.hmb.games.QuestionType'/>
                        <RadioButton label='Video Question' value='es.usc.citius.hmb.games.VideoQuestionType'/>
                        <RadioButton label='Picture Question' value='es.usc.citius.hmb.games.PictureQuestionType'/>
                    </RadioGroup>
                </section>
                <section className = { styles['multiSelector'] } >
                    <h1>
                        <FormattedMessage
                            id = 'games.editor.taskDialog.form.inputs.labels.answerType'
                            defaultMessage = 'Answer Type'
                            description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Answer Type'
                        />
                    </h1>
                    <RadioGroup  className={styles['radioGrp']} name='answerType' value={this.state.answerType} onChange={this.handleAnswerTypeChange}>
                        <RadioButton label='Option Answer' value='optionAnswer'/>
                        <RadioButton label='Text Answer' value='textAnswer'/>
                        <RadioButton label='True/False Answer' value='trueFalseAnswer'/>
                        <RadioButton label='Fill In The Blanks Answer' value='fillInTheBlanksAnswer'/>
                    </RadioGroup>
                </section>

                <section className = { styles['multiSelector'] } >
                    <h1>
                        <FormattedMessage
                            id = 'games.editor.taskDialog.form.inputs.labels.question'
                            defaultMessage = 'Question'
                            description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Question'
                        />
                    </h1>
                    { this.renderQuestionType() }
                    { this.renderAnswerType() }
                </section>

                <section className = { styles['multiSelector'] } >
                    <h1>
                        <FormattedMessage
                            id = 'games.editor.taskDialog.form.inputs.labels.tags'
                            defaultMessage = 'Add Tags'
                            description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Tags'
                        />
                    </h1>
                    <h1>
                        <div className={styles['columns']}>
                            <Input
                                type='text'
                                label='New Tag'
                                value={this.state.tag}
                                error = { this.state.showTagMandatory && formatMessage(messages.mandatory) || this.state.showTagCreated && formatMessage(messages.created) || ''}
                                onChange = { this.tagChange }
                            />
                            <Button
                                icon='add'
                                floating accent mini
                                className={styles['button']}
                                onClick={this.addTag}
                            />
                        </div>
                    </h1>
                    <section>
                        {
                            this.state.tags.length === 0 &&
                            <FormattedMessage
                                id='games.editor.taskDialog.form.inputs.values.roles.none'
                                description='Graph editor - Tasks Dialog - Form Inputs - Values - Roles - No tag has been added'
                                defaultMessage='No tag has been added'
                            />
                        }
                        {
                            this.state.tags.map((id) =>
                                <Chip
                                    key = { `${id}-chip` }
                                    deletable
                                    onDeleteClick={() => this.handleTagChange({id})}>
                                    { id }
                                </Chip>
                            )
                        }
                    </section>
                </section>
            </form>
        </Dialog>;
    }
}

export default CSSModules(injectIntl(QuestionDialog), styles);