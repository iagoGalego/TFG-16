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
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { autobind } from 'core-decorators'
import {Questionnaire, StringType} from "../../common/lib/model/questionnairesModel";


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
    }
});

@CSSModules(styles, {allowMultiple: true})
@autobind class QuestionnaireDialog extends Component{

    constructor(props){
        super(props);

        this.state = {
            name: '',
            showNameMandatory: false,
        }
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
            showNameMandatory: false,
        }));
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
            questionnaire.questions = [];
            questionnaire.tags = [];
            onSave(questionnaire);

            this.setState(prevState => ({
                name: '',
                showNameMandatory: false,
            }))
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
        >
            <form>
                <Input type='text'
                       label='Questionnaire Name'
                       value={this.state.name}
                       error = { this.state.showNameMandatory && formatMessage(messages.mandatory) || ''}
                       onChange = { this.nameChange }
                />
            </form>
        </Dialog>;
    }
}

export default CSSModules(injectIntl(QuestionnaireDialog), styles);