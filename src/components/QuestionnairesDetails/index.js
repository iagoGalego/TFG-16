import React, {Component} from 'react'
import PropTypes from "prop-types";
import CSSModules from 'react-css-modules'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import { Route } from "react-router-dom";
import Chip from 'react-toolbox/lib/chip'
import { Dialog } from 'react-toolbox/lib/dialog'
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
        description : 'Questionnaires page title',
        defaultMessage : 'Questionnaires'
    }
});

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles, {allowMultiple: true})
@autobind class QuestionnairesDetails extends Component {
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
            showTagMandatory: false,
            showTagCreated: false,
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

    componentWillReceiveProps(props){

        let isDifferent = props.questionnaireUri !== this.props.questionnaireUri;
        if(props.questionnaireUri !== undefined && isDifferent) this.props.selectQuestionnaire(props.questionnaireUri);
        else if(props.selectedQuestionnaire !== null){
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
        return response
    }

    componentDidMount(){
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

    render() {
        let { active, onCancel, intl: {formatMessage} } = this.props;

            return (
                <Dialog styleName = 'mainContainer'
                        active={active}
                        onEscKeyDown={onCancel}
                        onOverlayClick={onCancel}

                >
                    <section styleName = 'multiSelector tags' >
                        <div>
                            <h1>
                                <FormattedMessage
                                    id = 'games.editor.taskDialog.form.inputs.labels.details'
                                    defaultMessage = 'Questionnaire Details'
                                    description = 'Graph editor - Tasks Dialog - Questionnaire Details'
                                />
                            </h1>
                            <Input type='text' label='Name'
                                   styleName="input"
                                   value={this.state.questionnaire.name.stringValue}
                                   disabled={true}
                            />

                            {
                                this.state.questionnaire.tags.map(
                                    (tag) => {
                                        return <Chip
                                            styleName = "chip"
                                            key = { `${tag.uri}-chip` }
                                            deletable={false}>
                                            { tag.value.stringValue }
                                        </Chip>
                                    }
                                )
                            }
                        </div>
                    </section>
                    { this.renderList() }
                </Dialog>
            )
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

export default injectIntl(QuestionnairesDetails)