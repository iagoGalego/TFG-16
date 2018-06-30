import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import styles from './styles.scss'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import Chip from 'react-toolbox/lib/chip'
import Input from 'react-toolbox/lib/input';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import { autobind } from 'core-decorators'
import {Button, IconButton} from 'react-toolbox/lib/button';
import { Route } from "react-router-dom";
import QuestionnaireDialog from '../QuestionnaireDialog'
import ProgressBar from 'react-toolbox/lib/progress_bar';
import ReactDOM from "react-dom";
import Questionnaires from "../Questionnaires";
import {
    getAllQuestionnaires, saveQuestionnaire, deleteQuestionnaire, getQuestionnairesByName,
    setSelectedQuestionnaire, getAllTags, getTagsByName
} from "./Actions";
import {setTitle} from "../Layout/Actions";

const messages = defineMessages({
    title : {
        id : 'questionnaires.title',
        description : 'Questionnaires page title',
        defaultMessage : 'Questionnaires'
    }
});

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles, {allowMultiple: true})
@autobind class QuestionnairesList extends Component {
    constructor(props){
        super(props);

        this.state = {
            tagsAllowed: [],
            tag: '',
            isDisabled: false,
            activeDialog: false,
            name: '',
            loading: true,
            questionnaires: [],
            typing: false,
            typingTimeOut: 0
        }
    }

    componentWillReceiveProps(props){
        if(props.questionnaires !== null){
            this.setState({
                loading: false,
                questionnaires: [...props.questionnaires]
            })
        }
    }

    componentDidMount(){
        this.props.getAllTags();
        this.props.getAllQuestionnaires();
        this.setState(prevState => ({...prevState, loading: false}));
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title))
    }

    handleToggleDialog() {
        this.setState(prevState => ({...prevState, activeDialog: !this.state.activeDialog}));
    };

    handleDelete(value){
        this.setState(prevState => ({...prevState, loading: true}), () =>{
            this.forceUpdate();
            this.props.deleteQuestionnaire(value);
        });

    }

    searchQuestionnaires(name, tags){
        let st = '';
        for(let i = 0; i < tags.length; i++){
            if(i === 0 && tags[0] !== 'all') st += tags[i];
            else if(i !== 0) st += ","+ tags[i]
        }
        this.setState(prevState => ({...prevState, loading: true}), () =>{
            this.forceUpdate();
            this.props.getQuestionnairesByName(name, st);
            this.setState(prevState => ({...prevState}))
        })
    }

    handleTagsChange(value){
        let tag = value.filter((id) => this.state.tagsAllowed.find((i) => i === id) === undefined ), disabled;
        if(tag[0] === "all") {
            disabled = true;
            this.setState(prevState => ({tagsAllowed: tag, isDisabled: disabled}));
            ReactDOM.findDOMNode(this.__autocomplete).classList.remove(styles['autocomplete']);
            this.searchQuestionnaires(this.state.name,[]);
        }
        else {
            disabled = false;
            this.setState(prevState => ({tagsAllowed: value, isDisabled: disabled}));
            ReactDOM.findDOMNode(this.__autocomplete).classList.add(styles['autocomplete']);
            this.searchQuestionnaires(this.state.name, value);
        }
        document.getElementsByTagName("input")[1].disabled = disabled

    }

    nameChange(value) {
        if (this.state.typingTimeout)
            clearTimeout(this.state.typingTimeout);

        this.setState({
            name: value,
            typing: false,
            typingTimeout: setTimeout(() => {
                this.searchQuestionnaires(value, this.state.tagsAllowed);
            }, 500)
        });
    }

    renderTagsAndActions(questionnaire){
        let response = [];
        for(let i = 0; i < questionnaire.tags.length; i++){
            response.push(
                <Chip
                    key = { `${questionnaire.tags[i].value.stringValue}-chip` }>
                    { questionnaire.tags[i].value.stringValue }
                </Chip>
            )
        }
        response.push(
            <Route
                key = { `${questionnaire.uri}-route` }
                render={({ history}) => (
                <IconButton
                    icon="edit"
                    key = { `${questionnaire.uri}-edit` }
                    onClick={ () => {
                        history.push(`/app/questionnaires/${questionnaire.uri}/edit`)
                    }}
                />
            )}/>
        );
        response.push(
            <IconButton
                icon="delete"
                key = { `${questionnaire.uri}-delete` }
                onClick={() => this.handleDelete(questionnaire.uri)}
            />);
        return response
    }

    handleSave(questionnaire){
        this.setState(prevState => ({...prevState, loading: true, activeDialog: !this.state.activeDialog}),() =>{
            this.forceUpdate()
            this.props.saveQuestionnaire(questionnaire);
            this.setState(prevState => ({...prevState, name: '', tagsAllowed: []}));
        })
    }

    renderList(){
        if(this.state.questionnaires.length === 0){
            return <div styleName = 'empty'>
                <p>No questionnaire was found</p>
            </div>
        } else {
            return <List selectable ripple styleName = 'list'>
                <ListSubHeader caption='Questionnaires' />
                {
                    this.state.questionnaires.map(
                        (questionnaire) => {
                            return <ListItem
                                styleName = 'listItem'
                                key={questionnaire.uri}
                                caption= {questionnaire.name.stringValue}
                                ripple={false}
                                rightActions={ this.renderTagsAndActions(questionnaire) }
                            />
                        }
                    )
                }
            </List>
        }

    }

    getAutocompleteSource(){
        if(this.props.tags !== null){
            return this.props.tags.map(
                ({uri, displayName}) => {
                    return [displayName, uri]
                }).concat([["all", "All"]])
        } else return []
    }

    handleAutocompleteFocus(){
        this.props.getTagsByName(this.state.tag);
    }

    render() {

        return (
            <div styleName = 'mainContainer'>
                <section styleName = 'multiSelector tags' >
                    <div>
                        <h1>
                            <FormattedMessage
                                id = 'games.editor.taskDialog.form.inputs.labels.tags'
                                defaultMessage = 'Search Questionnaires'
                                description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Tags'
                            />
                        </h1>
                        <div styleName='columns'>
                            <Input styleName = 'input' type='text' label='Name'
                                   value={this.state.name}
                                   onChange = { this.nameChange }
                            />
                            <div
                                styleName = 'autocomplete'
                                ref = { element => this.__autocomplete = element }
                            >
                                <Autocomplete
                                    styleName = 'ac'
                                    direction="down"
                                    onChange={this.handleTagsChange}
                                    label="Choose Tags"
                                    suggestionMatch='anywhere'
                                    selectedPosition='below'
                                    source={this.getAutocompleteSource()}
                                    value={this.state.tagsAllowed}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                {
                    this.props.questionnaires === null || this.state.loading ?
                        <div styleName="loader">
                            <ProgressBar type='circular' mode='indeterminate'/>
                        </div>
                        :
                        this.renderList()
                }
                <div>
                    <Button
                        styleName='fullWidth'
                        label='Add Questionnaire'
                        onClick = {this.handleToggleDialog}
                        raised
                        accent
                    />
                </div>

                <QuestionnaireDialog
                    active={this.state.activeDialog}
                    user={this.props.loggedUser.uri}
                    onCancel = { this.handleToggleDialog }
                    onSave = { this.handleSave }
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        questionnaires: state.QuestionnairesState.questionnaires,
        tags: state.QuestionnairesState.tags,
        loggedUser: state.AuthState.loggedUser
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveQuestionnaire: bindActionCreators(saveQuestionnaire, dispatch),
        getQuestionnairesByName: bindActionCreators(getQuestionnairesByName, dispatch),
        getAllQuestionnaires: bindActionCreators(getAllQuestionnaires, dispatch),
        setAppTitle: bindActionCreators(setTitle, dispatch),
        deleteQuestionnaire: bindActionCreators(deleteQuestionnaire, dispatch),
        getAllTags: bindActionCreators(getAllTags, dispatch),
        getTagsByName: bindActionCreators(getTagsByName, dispatch),
    }
}

export default injectIntl(QuestionnairesList)