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

const messages = defineMessages({
    title : {
        id : 'questionnaires.title',
        description : 'Questionnaires page title',
        defaultMessage : 'Questionnaires'
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
        if(props.selectedQuestionnaire !== null){
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
        else
            this.setState({
                loading: false,
                dontExist: true
            })
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
                loading: false,
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

    handleSave(question){
        this.setState(prevState => ({...prevState, loading: true}), () => {
            this.forceUpdate();
            this.props.saveQuestion(question, this.props.selectedQuestionnaire.uri);
            this.setState(prevState => ({...prevState, activeDialog: !this.state.activeDialog}));
        })

    }

    handleUpdate(question){
        this.setState(prevState => ({...prevState, loading: true}), () => {
            this.forceUpdate();
            this.props.updateQuestion(question, this.props.selectedQuestionnaire.uri);
            this.setState(prevState => ({...prevState, activeDialog: !this.state.activeDialog}));
        })
    }

    changeName(value){
        this.setState(prevState => ({...prevState, modified: true,
            questionnaire: {...prevState.questionnaire, name: {...prevState.questionnaire.name, stringValue: value}}
        }));
    }

    handleDeleteTag(value, t){
        this.setState(prevState => ({...prevState, modified: true,
            questionnaire: {...prevState.questionnaire, tags: [...prevState.questionnaire.tags.filter((tag) => tag.uri !== t)]}
        }));
    }

    handleUpdateQuestionnaire(){
        this.props.updateQuestionnaire(this.state.questionnaire)
        this.setState(prevState => ({...prevState, modified: false}))
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

    addTag(value, tag){
        this.setState(prevState => ({...prevState, modified: true,
            questionnaire: {...prevState.questionnaire, tags: [...prevState.questionnaire.tags, tag]}
        }));
    }

    render() {
        let { selectedQuestionnaire } = this.props;

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
                                {
                                    this.state.questionnaire.tags.length < this.state.totalTags.length &&
                                    <div styleName='addTag'>
                                        <p>Add Tags</p>
                                        <IconMenu  icon='add' position='auto' menuRipple = {false}>
                                            {
                                                this.state.totalTags.filter(tag => !this.state.questionnaire.tags.map(tag => tag.uri).includes(tag.uri))
                                                    .map(
                                                        (tag) =>
                                                            <MenuItem key = { tag.uri }
                                                                      caption = { tag.value.stringValue }
                                                                      onClick = { () => this.addTag(true, tag) }
                                                            />
                                                    )
                                            }
                                        </IconMenu>
                                    </div>
                                }
                            </h1>
                            <Input styleName = 'input' type='text' label='Field'
                                   value={this.state.questionnaire.name.stringValue}
                                   onChange={ this.changeName }
                            />
                            {
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
                            }
                            <Button
                                styleName='saveButton'
                                label='Save'
                                onClick = {this.handleUpdateQuestionnaire}
                                disabled={ !this.state.modified }
                                raised
                                accent
                            />
                        </div>
                    </section>
                    { this.renderList() }
                    <Button
                        styleName='fullWidth'
                        label='Add Question'
                        onClick = {this.handleToggleDialog}
                        raised
                        accent
                    />
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
        getQuestionnaire: bindActionCreators(setSelectedQuestionnaire, dispatch),
        saveQuestion: bindActionCreators(saveQuestion, dispatch),
        updateQuestion: bindActionCreators(updateQuestion, dispatch),
        updateQuestionnaire: bindActionCreators(updateQuestionnaire, dispatch),
        deleteQuestion: bindActionCreators(deleteQuestion, dispatch),
        selectQuestionnaire: bindActionCreators(setSelectedQuestionnaire, dispatch),
    }
}

export default injectIntl(QuestionnairesEditor)