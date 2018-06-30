import React, {Component} from 'react'
import PropTypes from "prop-types";
import CSSModules from 'react-css-modules'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import { Route } from "react-router-dom";
import Chip from 'react-toolbox/lib/chip'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'
import styles from './styles.scss'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Input from 'react-toolbox/lib/input';
import { autobind } from 'core-decorators'
import Questionnaires from "../Questionnaires";
import {setTitle} from "../Layout/Actions";
import {Button, IconButton} from 'react-toolbox/lib/button';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import {setSelectedQuestionnaire, saveQuestion, updateQuestion, updateQuestionnaire, deleteQuestion} from "../QuestionnairesList/Actions";
import QuestionDialog from '../QuestionDialog'
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import {StringType, Tag} from "../../common/lib/model/questionnairesModel";

const messages = defineMessages({
    title : {
        id : 'questionnaires.title',
        description : 'Questionnaires Editor page title',
        defaultMessage : 'Questionnaires Editor'
    },
    created: {
        id: 'questionnaires.input.isCreated',
        description : 'Message to show when a tag is already created',
        defaultMessage: 'This tag is already created'
    },
    mandatory: {
        id: 'questionnaires.input.isMandatory',
        description : 'Message to show when a mandatory input is not fulfilled',
        defaultMessage: 'This input is mandatory'
    }
});

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles, {allowMultiple: true})
@autobind class QuestionnairesEditor extends Component {
    static contextTypes = {
        router: PropTypes.object
    };
    constructor(props, context){
        super(props, context);

        this.state = {
            modified:false,
            isDisabled: false,
            activeDialog: false,
            dontExist: false,
            loading: true,
            totalTags: [],
            tag: '',
            showTagCreated: false,
            showTagMandatory: false,
            showNameMandatory: false,
            questionnaire: {
                name: {
                    stringValue: ''
                },
                tags: [],
                questions: []
            },
            selectedQuestion: null
        }
    }

    handleToggleDialog() {
        this.setState(prevState => ({...prevState, selectedQuestion: null, activeDialog: !this.state.activeDialog}));
    };

    componentWillReceiveProps(props){

        if(props.selectedQuestionnaire !== null && props.selectedQuestionnaire !== this.props.selectedQuestionnaire){
            if(Object.keys(props.selectedQuestionnaire).length === 0 && props.selectedQuestionnaire.constructor === Object)
                this.setState({
                    loading: false,
                    dontExist: true
                });
            else {
                let totalTags = [];
                props.selectedQuestionnaire.questions.map(
                    (question) => {
                        question.tags.map(
                            (tag) => {
                                totalTags.push(tag)
                            }
                        )

                    }
                );
                totalTags = totalTags.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.uri === thing.uri
                    ))
                );

                this.setState({
                    loading: false,
                    dontExist: false,
                    totalTags: totalTags,
                    questionnaire: {
                        name: {
                            stringValue: ''
                        },
                        tags: [],
                        questions: [],
                        ...props.selectedQuestionnaire
                    }
                })
            }
        }

    }

    handleEditQuestion(question){
        this.setState(prevState => ({...prevState, selectedQuestion: question, activeDialog: true}));
    }

    renderTagsAndActions(question){
        let response = [];
        for(let i = 0; i < question.tags.length; i++){
            response.push(
                <Chip
                    key = { `${question.tags[i].value.stringValue}-chip` }>
                    { question.tags[i].value.stringValue }
                </Chip>
            )
        }
        response.push(
            <IconButton
                icon="edit"
                key = { `${question.uri}-edit` }
                onClick={ () => {
                    this.handleEditQuestion(question);
                }}
            />
        );
        response.push(
            <IconButton
                icon="delete"
                key = { `${question.uri}-delete` }
                onClick={() => this.handleDelete(question.uri)}
            />);
        return response
    }

    handleDelete(uri){
        this.setState(prevState => ({...prevState, loading: true}), () => {
            this.forceUpdate();
            this.props.deleteQuestion(uri, this.state.questionnaire.uri);
        })
    }

    componentDidMount(){
        this.props.selectQuestionnaire(this.props.location.pathname.split( '/' )[3]);
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title));
        if(this.props.selectedQuestionnaire !== null){
            this.setState({
                questionnaire: {
                    name: {
                        stringValue: ''
                    },
                    tags: [],
                    questions: [],
                    ...this.props.selectedQuestionnaire
                }
            })
        }
    }

    handleSave(data){
        this.setState(prevState => ({...prevState, loading: true}), () => {
            this.forceUpdate();
            this.props.saveQuestion(data, this.props.selectedQuestionnaire.uri);
            this.setState(prevState => ({...prevState, selectedQuestion: null, activeDialog: !this.state.activeDialog}));
        })

    }

    handleUpdate(data, question){
        this.setState(prevState => ({...prevState, loading: true}), () => {
            this.forceUpdate();
            this.props.updateQuestion(data, question, this.props.selectedQuestionnaire.uri);
            this.setState(prevState => ({...prevState, selectedQuestion: null, activeDialog: !this.state.activeDialog}));
        })
    }

    changeName(value){
        this.setState(prevState => ({...prevState, modified: true, showNameMandatory: false,
            questionnaire: {...prevState.questionnaire, name: {...prevState.questionnaire.name, stringValue: value}}
        }));
    }

    handleDeleteTag(value, t){
        this.setState(prevState => ({...prevState, modified: true,
            questionnaire: {...prevState.questionnaire, tags: [...prevState.questionnaire.tags.filter((tag) => tag.uri !== t)]}
        }));
    }

    handleUpdateQuestionnaire(){
        if(this.state.questionnaire.name.stringValue.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showNameMandatory: true
                }
            });
        else{
            this.props.updateQuestionnaire(this.state.questionnaire);
            this.setState(prevState => ({...prevState, modified: false}))
        }

    }

    renderList(){
        if(this.state.loading){
            return <div styleName="miniLoader">
                <ProgressBar type='circular' mode='indeterminate'/>
            </div>
        }
        else if(this.state.questionnaire.questions.length === 0){
            return <div styleName = 'empty'>
                <p>No questionnaire was found</p>
            </div>
        } else {
            return <List selectable ripple styleName = 'list'>
                <ListSubHeader caption='Questions' />
                {
                    this.state.questionnaire.questions.map(
                        (question) => {
                            return <ListItem
                                styleName = 'listItem'
                                key={question.uri}
                                caption= {question.statement.stringValue}
                                ripple={false}
                                rightActions={ this.renderTagsAndActions(question) }
                            />
                        }
                    )
                }
            </List>
        }
    }

    tagChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                tag: value,
                showTagCreated: false,
                showTagMandatory: false
            }
        });
    }

    addTag(value){
        if(this.state.tag.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showTagMandatory: true
                }
            });
        else{
            if(this.state.questionnaire.tags.find(tag => tag.value.stringValue === this.state.tag) === undefined){
                let t = new Tag();
                t.genURI();
                t.value = new StringType();
                t.value.stringValue = this.state.tag;
                this.setState(prevState => ({...prevState, modified: true, tag: '',
                    questionnaire: {...prevState.questionnaire, tags: [...prevState.questionnaire.tags, t]}
                }));
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

    render() {
        let { selectedQuestionnaire, intl: {formatMessage} } = this.props;

        if (this.state.dontExist){
            return  <div styleName="dontExist">
                <div styleName="row">
                    <p>The searched questionnaire does not exist</p>
                    <div>
                        <Route
                            render={({ history}) => (
                                <Button label='Search Questionnaires'
                                        raised
                                        primary
                                        onClick={ () => {
                                            history.push('/app/questionnaires')
                                        }}
                                />
                            )}/>
                    </div>
                </div>

            </div>
        } else if (selectedQuestionnaire === null){
            return <div styleName="loader">
                <ProgressBar type='circular' mode='indeterminate'/>
            </div>
        } else {
            return (
                <div styleName = 'mainContainer'>
                    <section styleName = 'multiSelector tags' >
                        <div>
                            <h1>
                                <FormattedMessage
                                    id = 'games.editor.taskDialog.form.inputs.labels.tags'
                                    defaultMessage = 'Edit Questionnaire'
                                    description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Tags'
                                />
                            </h1>
                            <div styleName="columns">
                                <Input styleName = 'input' type='text' label='Field'
                                       value={this.state.questionnaire.name.stringValue}
                                       error = { this.state.showNameMandatory && formatMessage(messages.mandatory) || ''}
                                       onChange={ this.changeName }
                                />
                                <div styleName="columns tagInput">
                                    <Input
                                        styleName = 'input'
                                        type='text'
                                        label='New Tag'
                                        value={this.state.tag}
                                        error = { this.state.showTagMandatory && formatMessage(messages.mandatory) || this.state.showTagCreated && formatMessage(messages.created) || ''}
                                        onChange = { this.tagChange }
                                    />
                                    <IconButton
                                        icon='add'
                                        className={styles['button']}
                                        onClick={this.addTag}
                                    />
                                </div>
                            </div>

                            <div styleName="columns2">
                                <div styleName="chips">
                                    {
                                        this.state.questionnaire.tags.length !== 0 ?
                                            this.state.questionnaire.tags.map(
                                                (tag) => {
                                                    return <Chip
                                                        styleName = "chip"
                                                        key = { `${tag.uri}-chip` }
                                                        deletable={true}
                                                        onDeleteClick = { () => this.handleDeleteTag(false, tag.uri) }>
                                                        { tag.value.stringValue }
                                                    </Chip>
                                                }
                                            )
                                            :
                                            <p styleName="emptyTags">
                                                This questionnaire doesn't have tags
                                            </p>
                                    }
                                </div>
                                <div styleName="buttonBotton">
                                    <Button
                                        styleName='saveButton'
                                        label='Save'
                                        onClick = {this.handleUpdateQuestionnaire}
                                        disabled={ !this.state.modified }
                                        raised
                                        accent
                                    />
                                </div>

                            </div>
                        </div>
                    </section>
                    { this.renderList() }
                    <div>
                        <Button
                            styleName='fullWidth'
                            label='Add Question'
                            onClick = {this.handleToggleDialog}
                            raised
                            accent
                        />
                    </div>
                    <QuestionDialog
                        active={this.state.activeDialog}
                        question={ this.state.selectedQuestion }
                        onCancel = { this.handleToggleDialog }
                        onSave = { this.handleSave }
                        onUpdate = { this.handleUpdate }
                    />
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        selectedQuestionnaire: state.QuestionnairesState.selectedQuestionnaire,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setAppTitle: bindActionCreators(setTitle, dispatch),
        saveQuestion: bindActionCreators(saveQuestion, dispatch),
        updateQuestion: bindActionCreators(updateQuestion, dispatch),
        updateQuestionnaire: bindActionCreators(updateQuestionnaire, dispatch),
        deleteQuestion: bindActionCreators(deleteQuestion, dispatch),
        selectQuestionnaire: bindActionCreators(setSelectedQuestionnaire, dispatch),
    }
}

export default injectIntl(QuestionnairesEditor)