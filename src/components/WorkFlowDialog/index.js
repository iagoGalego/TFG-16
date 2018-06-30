import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import Chip from 'react-toolbox/lib/chip'
import { Dialog } from 'react-toolbox/lib/dialog'
import styles from './styles.scss'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Input from 'react-toolbox/lib/input';
import { autobind } from 'core-decorators'
import DatePicker from 'react-toolbox/lib/date_picker'
import {setTitle} from "../Layout/Actions";
import {Button} from 'react-toolbox/lib/button';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import {setSelectedQuestionnaire, saveQuestion, updateQuestion, updateQuestionnaire, deleteQuestion} from "../QuestionnairesList/Actions";
import {setSelectedWorkflow} from "../GameEditor/Actions";


const messages = defineMessages({
    mandatory: {
        id: 'questionnaires.input.isMandatory',
        description : 'Message to show when a mandatory input is not fulfilled',
        defaultMessage: 'This input is mandatory'
    },
    incorrect: {
        id: 'questionnaires.input.isIncorrect',
        description : 'Message to show when a mandatory input is incorrect',
        defaultMessage: 'The interval time is incorrect'
    },
    created: {
        id: 'questionnaires.input.isCreated',
        description : 'Message to show when a tag is already created',
        defaultMessage: 'This tag is already created'
    }
});
const formLabel = defineMessages({
    condition : {
        id : 'games.editor.taskDialog.form.inputs.labels.condition',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Condition',
        defaultMessage : 'Condition'
    },
    name : {
        id : 'games.editor.taskDialog.form.inputs.labels.name',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Name',
        defaultMessage : 'Task name'
    },
    description: {
        id : 'games.editor.taskDialog.form.inputs.labels.description',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Description',
        defaultMessage : 'Description'
    },
    mandatory: {
        id : 'games.editor.taskDialog.form.inputs.labels.mandatory',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Mandatory',
        defaultMessage : 'Mandatory'
    },
    incorrect: {
        id : 'games.editor.taskDialog.form.inputs.labels.incorrect',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Incorrect',
        defaultMessage : 'Incorrect'
    },
    operator: {
        id : 'games.editor.taskDialog.form.inputs.labels.operator',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Operator',
        defaultMessage : 'Task type'
    },
    initialDate: {
        id : 'games.editor.taskDialog.form.inputs.labels.initialDate',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Initial date',
        defaultMessage : 'Initial date'
    },
    endingDate: {
        id : 'games.editor.taskDialog.form.inputs.labels.endingDate',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Ending date',
        defaultMessage : 'Ending date'
    },
    isTransitable: {
        id : 'games.editor.taskDialog.form.inputs.labels.isTransitable',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Is Transitable',
        defaultMessage : 'Is Transitable'
    },
    isDisabled: {
        id : 'games.editor.taskDialog.form.inputs.labels.isDisabled',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Is Disabled',
        defaultMessage : 'Is Disabled'
    },
    isRequired: {
        id : 'games.editor.taskDialog.form.inputs.labels.isRequired',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Is Required',
        defaultMessage : 'Is Required'
    }
});

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles, {allowMultiple: true})
@autobind class WorkFlowDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            uri: '',
            modified: false,
            name: '',
            description: '',
            tag: '',
            tags: [],
            showNameMandatory: false,
            showInitialTimeMandatory: false,
            showEndingTimeMandatory: false,
            showEndingTimeIncorrect: false,
            showTagMandatory: false,
            showTagCreated: false,
            initialDate: null,
            endingDate: null,
            initialTimeString: '',
            endingTimeString: '',
            loading: false
        }
    }

    handleTagChange(selectedTag){
        this.setState(prevState => ({...prevState, tags: this.state.tags.filter(id => id !== selectedTag.id)}))
    }

    componentWillReceiveProps(props) {
        if(props.workflowUri !== null && !this.state.loading ){
            this.props.setSelectedWorkflow(props.workflowUri);
            this.setState(prevState => ({
                ...prevState,
                loading: true
            }))
        }  else if(props.workflowUri === null) {
            this.setState(prevState => ({
                ...prevState,
                uri: '',
                name: '',
                description: '',
                tag: '',
                tags: [],
                showNameMandatory: false,
                showDescriptionMandatory: false,
                showInitialDateMandatory: false,
                showEndingDateMandatory: false,
                showInitialTimeMandatory: false,
                showEndingTimeMandatory: false,
                showEndingTimeIncorrect: false,
                initialDate: null,
                endingDate: null,
                initialTimeString: '',
                endingTimeString: '',
                loading: false
            }))
        } else if (props.selectedWorkflow !== null) {
            let tags = props.selectedWorkflow.metadata.filter(m => m.name === 'tag');

            let initialDate = null, endingDate = null, initialTimeString = '', endingTimeString = '';
            if(props.selectedWorkflow.startDate){
                initialDate = new Date(props.selectedWorkflow.startDate);
                initialTimeString = initialDate.getHours() + ":" + initialDate.getMinutes()
            }
            if(props.selectedWorkflow.expiryDate){
                endingDate = new Date(props.selectedWorkflow.expiryDate);
                endingTimeString= endingDate.getHours() + ":" + endingDate.getMinutes();
            }

            this.setState(prevState => ({
                ...prevState,
                uri: props.selectedWorkflow.uri,
                modified: false,
                name: props.selectedWorkflow.translation[0].name,
                description: props.selectedWorkflow.translation[0].longDescription,
                tag: '',
                tags: tags.map(m => m.metadataValue),
                showNameMandatory: false,
                showTagMandatory: false,
                showTagCreated: false,
                showInitialTimeMandatory: false,
                showEndingTimeMandatory: false,
                showEndingTimeIncorrect: false,
                initialDate: initialDate,
                endingDate: endingDate,
                initialTimeString: initialTimeString,
                endingTimeString: endingTimeString,
                loading: false
            }))
        }
    }

    tagChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                tag: value,
                modified: true,
                showTagMandatory: false,
                showTagCreated: false
            }
        });
    }

    handleDescriptionChange(value){
        this.setState(prevState => ({...prevState,
            description: value,
            modified: true,
        }))
    }

    nameChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                name: value,
                modified: true,
                showNameMandatory: false
            }
        });
    }


    addTag() {
        if(this.state.tag.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    modified: true,
                    showTagMandatory: true
                }
            });
        else{
            if(this.state.tags.find(tag => tag === this.state.tag) === undefined){
                this.setState(prevState => ({...prevState, tag: '', modified: true, tags: [...prevState.tags, this.state.tag]}))
            } else {
                this.setState((previousState) => {
                    return {
                        ...previousState,
                        modified: true,
                        showTagCreated: true
                    }
                });
            }
        }

    }

    handleInitialDateChange(value){
        if(this.state.initialTimeString !== ''){
            let res = this.state.initialTimeString.split(":");
            value.setHours(Number(res[0]));
            value.setMinutes(Number(res[1]));
            value.setSeconds(0);
        }
        this.setState(prevState => ({...prevState,
            initialDate: value,
            modified: true,
        }))
    }
    handleEndingDateChange(value){
        if(this.state.endingTimeString !== ''){
            let res = this.state.endingTimeString.split(":");
            value.setHours(Number(res[0]));
            value.setMinutes(Number(res[1]));
            value.setSeconds(0);
        }
        this.setState(prevState => ({...prevState,
            endingDate: value,
            modified: true,
        }))
    }
    handleInitialTimeChange(value){
        let t = this.state.initialDate;
        if(value !== '') {
            let res = value.split(":");
            t.setHours(Number(res[0]));
            t.setMinutes(Number(res[1]));
            t.setSeconds(0);
        }
        this.setState(prevState => ({...prevState,
            initialTimeString: value,
            initialDate: t,
            showInitialTimeMandatory: false,
            showEndingTimeIncorrect: false,
            modified: true,
        }))
    }
    handleEndingTimeChange(value){
        let t = this.state.endingDate;
        if(value !== ''){
            let res = value.split(":");
            t.setHours(Number(res[0]));
            t.setMinutes(Number(res[1]));
            t.setSeconds(0);
        }
        this.setState(prevState => ({
            ...prevState,
            endingTimeString: value,
            endingDate: t,
            modified: true,
            showEndingTimeMandatory: false,
            showEndingTimeIncorrect: false
        }))
    }
    handleSave(){
        let { onSave } = this.props;

        if(this.state.name.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showNameMandatory: true
                }
            });
        else if(this.state.initialDate !== null && this.state.initialTimeString === '')
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showInitialTimeMandatory: true
                }
            });
        else if(this.state.endingDate !== null && this.state.endingTimeString === '')
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showEndingTimeMandatory: true,
                }
            });
        else if(this.state.endingDate !== null && this.state.initialDate !== null &&
            this.state.endingDate.getTime() <= this.state.initialDate.getTime())
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showEndingTimeIncorrect: true
                }
            });
        else{
            let description;
            if(this.state.description.length <= 80){
                description = this.state.description;
            } else{
                description = this.state.description.slice(0, 81) + "...";
            }

            let payload = {
                uri: this.state.uri,
                name: this.state.name, description: description, longDescription: this.state.description,
                metadata: [],
                modificationDate: new Date().getTime()
            };
            if(this.state.initialDate) payload.startDate = this.state.initialDate.getTime();
            if(this.state.endingDate) payload.expiryDate= this.state.endingDate.getTime();

            payload.metadata = this.state.tags.map(
                (tag) => {
                    return {name: tag, metadataValue: tag}
                }
            );
            onSave(payload);
        }

    }


    render() {
        let { active, onCancel, intl: {formatMessage} } = this.props;

            return (
                <Dialog
                    active={active}
                    actions={[
                        { label: "Cancel", onClick: onCancel },
                        { label: "Save", onClick: this.handleSave }
                    ]}
                    styleName = "dialog"
                    onEscKeyDown={onCancel}
                    onOverlayClick={onCancel}
                    title='Save Workflow'
                >
                    {
                        this.state.loading?
                            <div styleName="loader">
                                <ProgressBar type='circular' mode='indeterminate'/>
                            </div>
                            :
                            <form>
                                <Input type='text'
                                       label='Workflow Name'
                                       value={this.state.name}
                                       error = { this.state.showNameMandatory && formatMessage(messages.mandatory) || ''}
                                       onChange = { this.nameChange }
                                />
                                <Input
                                    type='text'
                                    label = { formatMessage(formLabel.description) }
                                    value = { this.state.description }
                                    onChange = { this.handleDescriptionChange }
                                    multiline
                                />
                                <section styleName = 'datePicker'>
                                    <DatePicker label = { formatMessage(formLabel.initialDate) }
                                                locale = { this.props.language }
                                                value = { this.state.initialDate }
                                                maxDate = { this.state.endingDate }
                                                onChange = { this.handleInitialDateChange }
                                                autoOk
                                    />
                                    <Input styleName="timeStart" type="time" label='Initial time'
                                           onChange={this.handleInitialTimeChange}
                                           error = { this.state.showInitialTimeMandatory && formatMessage(messages.mandatory) || this.state.showEndingTimeIncorrect && formatMessage(messages.incorrect) || ''}
                                           disabled={this.state.initialDate === null}
                                           value={this.state.initialTimeString}/>

                                    <DatePicker label = { formatMessage(formLabel.endingDate) }
                                                locale = { this.props.language }
                                                value = { this.state.endingDate }
                                                onChange = { this.handleEndingDateChange }
                                                autoOk
                                    />
                                    <Input styleName="timeFinish" type="time" label='Ending time'
                                           onChange={this.handleEndingTimeChange}
                                           error = { this.state.showEndingTimeMandatory && formatMessage(messages.mandatory) || this.state.showEndingTimeIncorrect && formatMessage(messages.incorrect) || ''}
                                           disabled={this.state.endingDate === null}
                                           value={this.state.endingTimeString}/>

                                </section>
                                <section className = { styles['multiSelector'] } >
                                    <h1>
                                        <FormattedMessage
                                            id = 'games.editor.taskDialog.form.inputs.labels.tags'
                                            defaultMessage = 'Add Tags'
                                            description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Tags'
                                        />
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
                    }
                </Dialog>
            )
        }

}

function mapStateToProps(state) {
    return {
        selectedQuestionnaire: state.QuestionnairesState.selectedQuestionnaire,
        selectedWorkflow: state.GameEditorState.present.selectedWorkflow,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setAppTitle: bindActionCreators(setTitle, dispatch),
        saveQuestion: bindActionCreators(saveQuestion, dispatch),
        updateQuestion: bindActionCreators(updateQuestion, dispatch),
        updateQuestionnaire: bindActionCreators(updateQuestionnaire, dispatch),
        deleteQuestion: bindActionCreators(deleteQuestion, dispatch),
        setSelectedWorkflow: bindActionCreators(setSelectedWorkflow, dispatch),
    }
}

export default injectIntl(WorkFlowDialog)