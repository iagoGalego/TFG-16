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
})

const languages = CONFIG.app.languages.available
const langSelectorSource = []
languages.map(({code, name, flag}) => langSelectorSource.push({label: name, value: code, flag: require(`../../common/img/${flag}`)}))


@CSSModules(styles, {allowMultiple: true})
@autobind class QuestionnaireDialog extends Component{

    constructor(props){
        super(props);

        this.state = {
            name: '',
            tag: '',
            tags: []
        }
    }

    handleTagChange(selectedTag){
        this.setState(prevState => ({...prevState, tags: this.state.tags.filter(id => id !== selectedTag.id)}))
    }

    tagChange(value) {
        this.setState(prevState => ({...prevState, tag: value}))
    }

    addTag() {
        if(this.state.tags.find(tag => tag === this.state.tag) === undefined){
            this.setState(prevState => ({...prevState, tag: '', tags: [...prevState.tags, this.state.tag]}))
        } else {
            alert("Already created")
        }
    }

    render(){

    let { active, onSave, onCancel, intl: {formatMessage}, tags } = this.props;

    return <Dialog
            active={active}
            actions={[
                { label: "Cancel", onClick: onCancel },
                { label: "Save", onClick: onSave }
            ]}
            onEscKeyDown={onCancel}
            onOverlayClick={onCancel}
            title='Add New Questionnaire'
        >
            <form>
                <Input type='text' label='Questionnaire Name'/>
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