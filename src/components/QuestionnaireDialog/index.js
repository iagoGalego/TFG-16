import { Dialog } from 'react-toolbox/lib/dialog'
import CSSModules from 'react-css-modules'
import CONFIG from '../../common/config.json'

import Chip from 'react-toolbox/lib/chip'
import styles from './styles.scss'
import Input from 'react-toolbox/lib/input';
import {Button} from 'react-toolbox/lib/button';
import React, {Component} from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { autobind } from 'core-decorators'
import {Questionnaire, Tag, StringType} from "../../common/lib/model/questionnairesModel";


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
    }
});

@CSSModules(styles, {allowMultiple: true})
@autobind class QuestionnaireDialog extends Component{

    constructor(props){
        super(props);

        this.state = {
            name: '',
            tag: '',
            tags: [],
            showNameMandatory: false,
            showTagMandatory: false,
            showTagCreated: false
        }
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

    nameChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                name: value,
                showNameMandatory: false
            }
        });
    }

    handleCancel(){
        this.setState(prevState => ({
            name: '',
            tag: '',
            tags: [],
            showNameMandatory: false,
            showTagMandatory: false,
            showTagCreated: false
        }))
        this.props.onCancel()
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
        else{
            let questionnaire = new Questionnaire();
            questionnaire.genURI();
            questionnaire.name = new StringType();
            questionnaire.name.genURI();
            questionnaire.name.stringValue = this.state.name;
            questionnaire.user = new StringType();
            questionnaire.user.genURI();
            questionnaire.user.stringValue = this.props.user;
            questionnaire.questions = [];
            questionnaire.tags = [];
            this.state.tags.map(
                (tag) => {
                    let TAG = new Tag();
                    TAG.genURI();
                    TAG.value = new StringType();
                    TAG.value.genURI();
                    TAG.value.stringValue = tag;
                    questionnaire.tags.push(TAG)
                }
            );
            onSave(questionnaire);

            this.setState(prevState => ({
                name: '',
                tag: '',
                tags: [],
                showNameMandatory: false,
                showTagMandatory: false,
                showTagCreated: false
            }))
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

    render(){

        let { active, intl: {formatMessage} } = this.props;

        return <Dialog
            active={active}
            actions={[
                { label: "Cancel", onClick: this.handleCancel },
                { label: "Save", onClick: this.handleSave }
            ]}
            onEscKeyDown={this.handleCancel}
            onOverlayClick={this.handleCancel}
            title='Add New Questionnaire'
            styleName="dialog"
        >
            <form>
                <Input type='text'
                       label='Questionnaire Name'
                       value={this.state.name}
                       error = { this.state.showNameMandatory && formatMessage(messages.mandatory) || ''}
                       onChange = { this.nameChange }
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
        </Dialog>;
    }
}

export default CSSModules(injectIntl(QuestionnaireDialog), styles);