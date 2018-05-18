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
import {setSelectedQuestionnaire, saveQuestion, updateQuestion, updateQuestionnaire, deleteQuestion} from "../QuestionnairesList/Actions";


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
            provider: '',
            tag: '',
            tags: [],
            showNameMandatory: false,
            showProviderMandatory: false,
            showDescriptionMandatory: false,
            showInitialDateMandatory: false,
            showEndingDateMandatory: false,
            showTagMandatory: false,
            showTagCreated: false,
            initialDate: null,
            endingDate: null,
        }
    }

    handleTagChange(selectedTag){
        this.setState(prevState => ({...prevState, tags: this.state.tags.filter(id => id !== selectedTag.id)}))
    }

    componentWillReceiveProps(props) {
        if (props.selectedWorkflow !== null) {
            let tags = props.selectedWorkflow.metadata.filter(m => m.name === 'tag');
            this.setState(prevState => ({
                ...prevState,
                uri: props.selectedWorkflow.uri,
                modified: false,
                name: props.selectedWorkflow.translation[0].name,
                description: props.selectedWorkflow.translation[0].longDescription,
                provider: props.selectedWorkflow.provider,
                tag: '',
                tags: tags.map(m => m.metadataValue),
                showNameMandatory: false,
                showProviderMandatory: false,
                showDescriptionMandatory: false,
                showInitialDateMandatory: false,
                showEndingDateMandatory: false,
                showTagMandatory: false,
                showTagCreated: false,
                initialDate: new Date(props.selectedWorkflow.startDate),
                endingDate: new Date(props.selectedWorkflow.expiryDate),
            }))
        } else if(!this.state.modified) {
            this.setState(prevState => ({
                uri: '',
                name: '',
                description: '',
                provider: '',
                tag: '',
                tags: [],
                showNameMandatory: false,
                showProviderMandatory: false,
                showDescriptionMandatory: false,
                showInitialDateMandatory: false,
                showEndingDateMandatory: false,
                showTagMandatory: false,
                showTagCreated: false,
                initialDate: null,
                endingDate: null,
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
            showDescriptionMandatory: false
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

    providerChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                provider: value,
                modified: true,
                showProviderMandatory: false
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
        this.setState(prevState => ({...prevState,
            initialDate: value,
            modified: true,
            showInitialDateMandatory: false
        }))
    }
    handleEndingDateChange(value){
        this.setState(prevState => ({...prevState,
            endingDate: value,
            modified: true,
            showEndingDateMandatory: false
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
        else if(this.state.description.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showDescriptionMandatory: true
                }
            });
        else if(this.state.initialDate === null)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showInitialDateMandatory: true
                }
            });
        else if(this.state.endingDate === null)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showEndingDateMandatory: true
                }
            });
        else if(this.state.provider.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showProviderMandatory: true
                }
            });
        else{
            let description;
            if(this.state.description.length <= 10){
                description = this.state.description;
            } else{
                description = this.state.description.slice(0, 11) + "...";
            }

            let payload = {
                uri: this.state.uri,
                name: this.state.name, description: description, longDescription: this.state.description,
                startDate: this.state.initialDate.getTime(), expiryDate: this.state.endingDate.getTime(),
                metadata: [],
                modificationDate: new Date().getTime(), provider: this.state.provider
            };
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
                            error = { this.state.showDescriptionMandatory && formatMessage(messages.mandatory) || ''}
                            onChange = { this.handleDescriptionChange }
                            multiline
                        />
                        <section styleName = 'datePicker'>
                            <DatePicker label = { formatMessage(formLabel.initialDate) }
                                        locale = { this.props.language }
                                        value = { this.state.initialDate }
                                        maxDate = { this.state.endingDate }
                                        error = { this.state.showInitialDateMandatory && formatMessage(messages.mandatory) || ''}
                                        onChange = { this.handleInitialDateChange }
                                        autoOk
                            />
                            <DatePicker label = { formatMessage(formLabel.endingDate) }
                                        locale = { this.props.language }
                                        error = { this.state.showEndingDateMandatory && formatMessage(messages.mandatory) || ''}
                                        value = { this.state.endingDate }
                                        minDate = { this.state.initialDate }
                                        onChange = { this.handleEndingDateChange }
                                        autoOk
                            />
                        </section>
                        <Input type='text'
                               label='Provider Name'
                               value={this.state.provider}
                               error = { this.state.showProviderMandatory && formatMessage(messages.mandatory) || ''}
                               onChange = { this.providerChange }
                        />
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
        getQuestionnaire: bindActionCreators(setSelectedQuestionnaire, dispatch),
        saveQuestion: bindActionCreators(saveQuestion, dispatch),
        updateQuestion: bindActionCreators(updateQuestion, dispatch),
        updateQuestionnaire: bindActionCreators(updateQuestionnaire, dispatch),
        deleteQuestion: bindActionCreators(deleteQuestion, dispatch),
        selectQuestionnaire: bindActionCreators(setSelectedQuestionnaire, dispatch),
    }
}

export default injectIntl(WorkFlowDialog)