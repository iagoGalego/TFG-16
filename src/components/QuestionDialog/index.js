/**
 * Created by victorjose.gallego on 7/21/16.
 */
import { Dialog } from 'react-toolbox/lib/dialog'
import CSSModules from 'react-css-modules'
import CONFIG from '../../common/config.json'

import Chip from 'react-toolbox/lib/chip'
import styles from './styles.scss'
import Input from 'react-toolbox/lib/input';
import {Button} from 'react-toolbox/lib/button';
import React, {Component} from 'react'
import Checkbox from 'react-toolbox/lib/checkbox';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { autobind } from 'core-decorators'
import {
    Question, Tag, StringType, QuestionType, VideoQuestionType,
    PictureQuestionType, TrueFalseQuestionType, ChooseOneOptionQuestion, ChooseVariousOptionsQuestion,
    Option, TextSolution, QuestionWithRating,
    InsertOneTextQuestion, InsertVariousTextsQuestion
} from "../../common/lib/model/questionnairesModel";
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import Dropdown from 'react-toolbox/lib/dropdown';
import {BooleanType, IntegerType} from "../../common/lib/model";

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
            tag: '',
            tags: [],
            videoURL: '',
            pictureURL: '',
            showStatementMandatory: false,
            showVideoMandatory: false,
            showPictureMandatory: false,
            showScoreMandatory: false,
            showTagMandatory: false,
            showTagCreated: false,
            showTrueFalseScoreMandatory: false,
            showTextResponseError: [{
                textMandatory: false,
                numberMandatory: false,
            }],
            showOptionResponseError: [{
                textMandatory: false,
                numberMandatory: false,
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
            optionResponse: [{
                text: '',
                score: 0,
                selected: false
            }],
            optionSelected: 0,
            isRated: false,
            rate: 0,
            isNew: true
        }
    }

    componentWillReceiveProps(props) {
        if (props.question !== null){
            let cardinality, answerType, options=[], trueFalseResponse= {value: 'true', score: 0};
            let textErrors = [], optionErrors = [];
            let textResponses= [], selectedOption = 0;
            if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.ChooseOneOptionQuestion"){
                cardinality = 'simple';
                answerType = 'optionAnswer'
                options = props.question.answerType.options.map(
                    (option, idx) => {
                        optionErrors.push({textMandatory: false, numberMandatory: false});
                        if(props.question.answerType.solution.uri === option.uri) selectedOption = idx;
                        return {text: option.text.stringValue, score: option.score.integerValue, selected: false}
                    }
                )
                textResponses.push({
                    text: '',
                    score: 0
                })
                textErrors.push({
                    textMandatory: false,
                    numberMandatory: false,
                });
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.ChooseVariousOptionsQuestion"){
                cardinality = 'multiple';
                answerType = 'optionAnswer';
                options = props.question.answerType.options.map(
                    (option) => {
                        let selected = props.question.answerType.solutions.find( ({uri}) =>  uri === option.uri ) !== undefined;
                        optionErrors.push({textMandatory: false, numberMandatory: false});
                        return {text: option.text.stringValue, score: option.score.integerValue, selected: selected}
                    }
                )
                textResponses.push({
                    text: '',
                    score: 0
                })
                textErrors.push({
                    textMandatory: false,
                    numberMandatory: false,
                });
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.TrueFalseQuestionType"){
                cardinality = 'simple';
                answerType = 'trueFalseAnswer';
                trueFalseResponse.value = props.question.answerType.solution.booleanValue? "true" : "false";
                trueFalseResponse.score = props.question.answerType.score.integerValue;
                textResponses.push({
                    text: '',
                    score: 0
                });
                textErrors.push({
                    textMandatory: false,
                    numberMandatory: false,
                });
                options.push({
                    text: '',
                    score: 0,
                    selected: false
                });
                optionErrors.push({
                    textMandatory: false,
                    numberMandatory: false,
                })
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.InsertOneTextQuestion"){
                cardinality = 'simple';
                answerType = 'textAnswer';
                textErrors.push({textMandatory: false, numberMandatory: false});
                textResponses.push({
                    text: props.question.answerType.solution.solution.stringValue,
                    score: props.question.answerType.solution.score.integerValue
                });
                options.push({
                    text: '',
                    score: 0,
                    selected: false
                })
                optionErrors.push({
                    textMandatory: false,
                    numberMandatory: false,
                })
            } else if(props.question.answerType["@class"] === "es.usc.citius.hmb.games.InsertVariousTextsQuestion"){
                cardinality = 'multiple';
                answerType = 'textAnswer';
                props.question.answerType.solutions.map(
                    (solution) => {
                        textErrors.push({textMandatory: false, numberMandatory: false});
                        textResponses.push({
                            text: solution.solution.stringValue,
                            score: solution.score.integerValue
                        });
                    }
                )
                options.push({
                    text: '',
                    score: 0,
                    selected: false
                })
                optionErrors.push({
                    textMandatory: false,
                    numberMandatory: false,
                })
            }

            this.setState({
                uri: props.question.uri,
                statement: props.question.statement.stringValue,
                tag: '',
                tags: props.question.tags.map((tag) => {return tag.value.stringValue}),
                videoURL: props.question.questionType["@class"] === 'es.usc.citius.hmb.games.VideoQuestionType'?
                    props.question.questionType.videoURL.stringValue : '',
                pictureURL: props.question.questionType["@class"] === 'es.usc.citius.hmb.games.PictureQuestionType'?
                    props.question.questionType.imageURL.stringValue : '',
                showStatementMandatory: false,
                showScoreMandatory: false,
                showTagMandatory: false,
                showTagCreated: false,
                showTrueFalseScoreMandatory: false,
                showTextResponseError: textErrors,
                showOptionResponseError: optionErrors,
                questionType: props.question.questionType["@class"],
                answerType: answerType,
                cardinality: cardinality,
                trueFalseResponse: trueFalseResponse,
                textResponse: textResponses,
                optionResponse: options,
                optionSelected: selectedOption,
                isRated: props.question["@class"] === "es.usc.citius.hmb.games.QuestionWithRating",
                rate: props.question["@class"] === "es.usc.citius.hmb.games.QuestionWithRating"?
                    props.question.rating.integerValue : 0,
                isNew: false
            })
        } else {
            this.setState({
                statement: '',
                tag: '',
                tags: [],
                videoURL: '',
                pictureURL: '',
                showStatementMandatory: false,
                showVideoMandatory: false,
                showPictureMandatory: false,
                showTagMandatory: false,
                showTagCreated: false,
                showScoreMandatory: false,
                showTrueFalseScoreMandatory: false,
                showTextResponseError: [{
                    textMandatory: false,
                    numberMandatory: false,
                }],
                showOptionResponseError: [{
                    textMandatory: false,
                    numberMandatory: false,
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
                optionResponse: [{
                    text: '',
                    score: 0,
                    selected: false
                }],
                optionSelected: 0,
                isRated: false,
                rate: 0,
                isNew: true
            })
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
                showTrueFalseScoreMandatory: false
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

    anyOptionInvalid(){
        for(let i = 0; i < this.state.optionResponse.length; i++){
            if(this.state.optionResponse[i].text.length === 0 ||
                this.state.optionResponse[i].score.length === 0) return true
        }
        return false;
    }
    anyTextInvalid(){
        for(let i = 0; i < this.state.textResponse.length; i++){
            if(this.state.textResponse[i].text.length === 0 ||
                this.state.textResponse[i].score.length === 0) return true
        }
        return false;
    }


    isAnyOptionSelected(){
        for(let i = 0; i < this.state.optionResponse.length; i++){
            if(this.state.optionResponse[i].selected) return true
        }
        return false
    }

    handleSave(){
        let { onSave, onUpdate } = this.props;

        let question, options = { uri: this.state.uri };
        if(this.state.statement.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showStatementMandatory: true
                }
            });
        else if(this.state.questionType === 'es.usc.citius.hmb.games.VideoQuestionType' && this.state.videoURL.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showVideoMandatory: true
                }
            });
        else if(this.state.questionType === 'es.usc.citius.hmb.games.PictureQuestionType' && this.state.pictureURL.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showPictureMandatory: true
                }
            });
        else if(this.state.answerType === 'optionAnswer' && this.anyOptionInvalid()){
            const newOptionErrors = this.state.optionResponse.map((optionResponse, sidx) => {
                if (optionResponse.text.length === 0) {
                    return {textMandatory: true, numberMandatory: this.state.showOptionResponseError[sidx].numberMandatory};
                } else if(optionResponse.score.length === 0){
                    return {textMandatory: this.state.showOptionResponseError[sidx].textMandatory, numberMandatory: true};
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
                    return {textMandatory: true, numberMandatory: this.state.showTextResponseError[sidx].numberMandatory};
                } else if(textResponse.score.length === 0){
                    return {textMandatory: this.state.showTextResponseError[sidx].textMandatory, numberMandatory: true};
                }
                return this.state.showTextResponseError[sidx];
            });

            this.setState((previousState) => {
                return {
                    ...previousState,
                    showTextResponseError: newTextErrors
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
                question.questionType.videoURL.stringValue = this.state.videoURL
            } else if(this.state.questionType === 'es.usc.citius.hmb.games.PictureQuestionType'){
                question.questionType = new PictureQuestionType();
                question.questionType.genURI();
                question.questionType.imageURL = new StringType();
                question.questionType.imageURL.stringValue = this.state.pictureURL
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
            alert(JSON.stringify(question));
            if(this.state.isNew) onSave(question);
            else onUpdate(question)
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

    videoURLChange(value){
        this.setState(prevState => ({...prevState, videoURL: value, showVideoMandatory: false}))
    }

    pictureURLChange(value){
        this.setState(prevState => ({...prevState, pictureURL: value, showPictureMandatory: false}))
    }

    renderQuestionType(){
        let { intl: {formatMessage} } = this.props;

        switch(this.state.questionType){
            case 'es.usc.citius.hmb.games.VideoQuestionType':
                return <Input type='text'
                              label='Video URL'
                              value={this.state.videoURL}
                              error = { this.state.showVideoMandatory && formatMessage(messages.mandatory) || ''}
                              onChange = { this.videoURLChange }
                />;
            case 'es.usc.citius.hmb.games.PictureQuestionType':
                return <Input type='text'
                              label='Picture URL'
                              value={this.state.pictureURL}
                              error = { this.state.showPictureMandatory && formatMessage(messages.mandatory) || ''}
                              onChange = { this.pictureURLChange }
                />;
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
            newTextErrors.push({textMandatory: false, numberMandatory: false});
            return { ...textResponse, text: value };
        });

        this.setState(prevState => ({
            ...prevState,
            textResponse: newTextResponse,
            showTextResponseError: newTextErrors
        }));
    }

    textScoreChange(idx, value) {
        if(value === '' || !Number.isNaN(Number.parseInt(value)) && value >= 0) {
            let newTextErrors = [];
            const newTextResponse = this.state.textResponse.map((textResponse, sidx) => {
                if (idx !== sidx) {
                    newTextErrors.push(this.state.showTextResponseError[sidx]);
                    return textResponse;
                }
                newTextErrors.push({textMandatory: false, numberMandatory: false});
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
            newOptionErrors.push({textMandatory: false, numberMandatory: false});
            return { ...optionResponse, text: value };
        });

        this.setState(prevState => ({
            ...prevState,
            optionResponse: newOptionResponse,
            showOptionResponseError: newOptionErrors
        }));
    }

    optionScoreChange(idx, value) {
        if(value === '' || !Number.isNaN(Number.parseInt(value)) && value >= 0) {
            let newOptionErrors = [];
            const newOptionResponse = this.state.optionResponse.map((optionResponse, sidx) => {
                if (idx !== sidx) {
                    newOptionErrors.push(this.state.showOptionResponseError[sidx]);
                    return optionResponse;
                }
                newOptionErrors.push({textMandatory: false, numberMandatory: false});
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
        this.setState(prevState => ({ ...prevState, optionSelected: idx }));
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
        const newOptionResponse = this.state.optionResponse.map((optionResponse, sidx) => {
            if (idx !== sidx) return optionResponse;
            return { ...optionResponse, selected: !optionResponse.selected };
        });
        this.setState(prevState => ({ ...prevState, optionResponse: newOptionResponse }));
    }

    addTextResponse() {
        let responseErrors= [];
        const newTextResponse = this.state.textResponse.map((textResponse, sidx) => {
            responseErrors.push(this.state.showTextResponseError[sidx]);
            return textResponse;
        });
        newTextResponse.push({text: '', score: 0});
        responseErrors.push({textMandatory: false, numberMandatory: false});

        this.setState(prevState => ({ ...prevState, textResponse: newTextResponse, showTextResponseError: responseErrors }));
    }

    addOptionResponse() {
        let responseErrors= [];
        const newOptionResponse = this.state.optionResponse.map((optionResponse, sidx) => {
            responseErrors.push(this.state.showOptionResponseError[sidx]);
            return optionResponse;
        });
        newOptionResponse.push({text: '', score: 0});
        responseErrors.push({textMandatory: false, numberMandatory: false});

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
                               error = { this.state.showTextResponseError[0].numberMandatory && formatMessage(messages.mandatory) || ''}
                               onChange = { (value) => this.textScoreChange(0, value) }
                        />
                        <Button
                            key={`Shareholder #${0} delete`}
                            icon='delete'
                            floating accent mini
                            className={styles['buttonDelete']}
                            disabled
                            onClick = { (value) => this.deleteTextResponse(0, value) }
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
                                   error = { this.state.showTextResponseError[idx].numberMandatory && formatMessage(messages.mandatory) || ''}
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
                                   error = { this.state.showOptionResponseError[idx].numberMandatory && formatMessage(messages.mandatory) || ''}
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
                                   error = { this.state.showOptionResponseError[idx].numberMandatory && formatMessage(messages.mandatory) || ''}
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

    renderAnswerType(){
        let { intl: {formatMessage} } = this.props;

        switch(this.state.answerType){
            case 'optionAnswer':
                return  <div>
                    <Dropdown
                        auto
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
                           error = { this.state.showTrueFalseScoreMandatory && formatMessage(messages.mandatory) || ''}
                           onChange = { this.handleTrueFalseScoreChange }
                    />
                </div>
            default:
        }
    }

    render(){

    let { active, onCancel, intl: {formatMessage} } = this.props;

    return <Dialog
        styleName="dialog"
            active={active}
            actions={[
                { label: "Cancel", onClick: onCancel },
                { label: this.state.isNew? 'Save' : 'Edit' , onClick: this.handleSave }
            ]}
            onEscKeyDown={onCancel}
            onOverlayClick={onCancel}
            title={ this.state.isNew? 'Add New Question' : 'Edit Question' }
        >
            <form>
                <Input type='text'
                       label='Question Statement'
                       value={this.state.statement}
                       error = { this.state.showStatementMandatory && formatMessage(messages.mandatory) || ''}
                       onChange = { this.statementChange }
                />
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
                    { this.renderQuestionType() }
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
                    </RadioGroup>
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
                <section className = { styles['multiSelector'] } >
                    <h1>
                        <FormattedMessage
                            id = 'games.editor.taskDialog.form.inputs.labels.rate'
                            defaultMessage = 'Rating'
                            description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Rate'
                        />
                    </h1>
                    <div styleName="columns">
                        <Checkbox
                            checked= { this.state.isRated }
                            styleName = "checkbox"
                            label= "Is Rated"
                            onChange = { this.rateCheckedChange }
                        />
                        <Input type="text"
                               disabled={!this.state.isRated}
                               value={ this.state.rate }
                               label= "Score"
                               error = { this.state.showScoreMandatory && formatMessage(messages.mandatory) || ''}
                               onChange={ this.rateChange }
                        />
                    </div>
                </section>
            </form>
        </Dialog>;
    }
}

export default CSSModules(injectIntl(QuestionDialog), styles);