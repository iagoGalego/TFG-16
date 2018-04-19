import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import styles from './styles.scss'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setTitle} from "../Layout/Actions";
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import Input from 'react-toolbox/lib/input';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import { autobind } from 'core-decorators'
import ROLE_NAME from "../../common/lib/model/RoleNames";
import Button from 'react-toolbox/lib/button'
import QuestionnaireDialog from '../QuestionnaireDialog'
import ReactDOM from "react-dom";
import Questionnaires from "../Questionnaires";

const messages = defineMessages({
    title : {
        id : 'questionnaires.title',
        description : 'Questionnaires page title',
        defaultMessage : 'Questionnaires'
    }
});

@connect(() => {return {}}, (dispatch) => {return {setAppTitle: bindActionCreators(setTitle, dispatch)}})
@CSSModules(styles, {allowMultiple: true})
@autobind class GameList extends Component {
    constructor(props){
        super(props);

        this.state = {
            tagsAllowed: [],
            isDisabled: false,
            activeDialog: false,
            tags: []
        }
    }

    componentWillReceiveProps(props){
    }

    static defaultProps = {
        HMBData: {
            tags: [
                {
                    "@class": "es.usc.citius.hmb.model.Tag",
                    "isLoaded": true,
                    "provider": "es.usc.citius.hmb.questionnaires",
                    "user": [],
                    "name": "gameadmin",
                    "isSubTagOf": [
                        {
                            "@class": "es.usc.citius.hmb.model.Tag",
                            "isLoaded": true,
                            "provider": null,
                            "user": [],
                            "name": "admin",
                            "isSubTagOf": [],
                            "displayName": "Administrator",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_Admin"
                        }
                    ],
                    "displayName": "Game admin",
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_GameAdmin"
                },
                {
                    "@class": "es.usc.citius.hmb.model.Tag",
                    "isLoaded": true,
                    "provider": null,
                    "user": [],
                    "name": "admin",
                    "isSubTagOf": [],
                    "displayName": "Admin",
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_Admin"
                },
                {
                    "@class": "es.usc.citius.hmb.model.Tag",
                    "isLoaded": true,
                    "provider": "es.usc.citius.hmb.questionnaires",
                    "user": [],
                    "name": "gameuser",
                    "isSubTagOf": [
                        {
                            "@class": "es.usc.citius.hmb.model.Tag",
                            "isLoaded": true,
                            "provider": null,
                            "user": [],
                            "name": "user",
                            "isSubTagOf": [],
                            "displayName": "User",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_User"
                        }
                    ],
                    "displayName": "Game User",
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_GameUser"
                },
                {
                    "@class": "es.usc.citius.hmb.model.Tag",
                    "isLoaded": true,
                    "provider": null,
                    "user": [],
                    "name": "user",
                    "isSubTagOf": [],
                    "displayName": "User",
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_User"
                },
                {
                    "@class": "es.usc.citius.hmb.model.Tag",
                    "isLoaded": true,
                    "provider": null,
                    "user": [],
                    "name": "root",
                    "isSubTagOf": [],
                    "displayName": "Root",
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_Root"
                },
                {
                    "@class": "es.usc.citius.hmb.model.Tag",
                    "isLoaded": true,
                    "provider": "es.usc.citius.hmb.questionnaires",
                    "user": [],
                    "name": "useradmin",
                    "isSubTagOf": [
                        {
                            "@class": "es.usc.citius.hmb.model.Tag",
                            "isLoaded": true,
                            "provider": null,
                            "user": [],
                            "name": "admin",
                            "isSubTagOf": [],
                            "displayName": "Administrator",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_Admin"
                        }
                    ],
                    "displayName": "User admin",
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_UserAdmin"
                }],
        }
    };

    componentWillMount(){
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title))
    }

    handleToggleDialog = () => {
        this.setState(prevState => ({...prevState, activeDialog: !this.state.activeDialog}));
    };

    getLocalizedRoleNameFromId(id){
        let {intl: {formatMessage}} = this.props;

        let defaultRole = this.props.HMBData.tags.filter(rol => rol.name === id)[0]
        let defaultRoleName = ( defaultRole !== undefined && defaultRole.displayName ) || id

        return (ROLE_NAME[id] && formatMessage(ROLE_NAME[id])) || defaultRoleName
    }

    handleRolesChange(value, tag){
        if(value && tag.id === 'all')
            this.setState(prevState => ({
                    tagsAllowed: this.props.HMBData.tags.map(({name, displayName}) => ({
                        id: name,
                        name: displayName
                    }))
            }))
        else if (value)
            this.setState(prevState => ({tagsAllowed: [...prevState.tagsAllowed, tag]}))
        else if (tag.id === 'all')
            this.setState(prevState => ({tagsAllowed: []}));
        else
            this.setState(prevState => ({tagsAllowed: prevState.tagsAllowed.filter(({id}) => id !== tag.id)}))

    }

    handleTagsChange(value){
        let tag = value.filter((id) => this.state.tagsAllowed.find((i) => i === id) === undefined ), disabled;
        if(tag[0] === "all") {
            disabled = true;
            this.setState(prevState => ({tagsAllowed: tag, isDisabled: disabled}));
            ReactDOM.findDOMNode(this.__autocomplete).classList.remove(styles['autocomplete']);
        }
        else {
            disabled = false;
            this.setState(prevState => ({tagsAllowed: value, isDisabled: disabled}));
            ReactDOM.findDOMNode(this.__autocomplete).classList.add(styles['autocomplete']);
        }
        document.getElementsByTagName("input")[1].disabled = disabled

    }

    render() {
        let { HMBData } = this.props;

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
                            <Input styleName = 'input' type='text' label='Field'/>
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
                                    source={HMBData.tags.map(({uri, displayName}) => {return [uri, displayName]}).concat([["all", "All"]])}
                                    value={this.state.tagsAllowed}
                                />
                            </div>
                    </div>
                </section>
                <List selectable ripple styleName = 'list'>
                    <ListSubHeader caption='Questionnaires' />
                    <ListItem
                        caption='Questionnaire_01'
                        legend="POO, AOS"
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_02'
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_03'
                        legend='POO'
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_01'
                        legend="POO, AOS"
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_02'
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_03'
                        legend='POO'
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_01'
                        legend="POO, AOS"
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_02'
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_03'
                        legend='POO'
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_01'
                        legend="POO, AOS"
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_02'
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                    <ListItem
                        caption='Questionnaire_03'
                        legend='POO'
                        leftIcon='edit'
                        rightIcon='delete'
                    />
                </List>
                <Button
                    styleName='fullWidth'
                    label='Add Questionnaire'
                    onClick = {this.handleToggleDialog}
                    raised
                    accent
                />

                <QuestionnaireDialog
                    active={this.state.activeDialog}
                    onCancel = { this.handleToggleDialog }
                    onSave = { this.handleToggleDialog }
                    tags = {this.state.tags}
                />
            </div>
        )
    }
}

export default injectIntl(GameList)