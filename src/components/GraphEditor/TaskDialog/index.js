import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { autobind } from 'core-decorators'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'
import {Button, IconButton} from 'react-toolbox/lib/button';
import Checkbox from 'react-toolbox/lib/checkbox'
import Dropdown from 'react-toolbox/lib/dropdown'
import DatePicker from 'react-toolbox/lib/date_picker'
import Avatar from 'react-toolbox/lib/avatar'
import Tooltip from 'react-toolbox/lib/tooltip'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'
import Chip from 'react-toolbox/lib/chip'
import Autocomplete from 'react-toolbox/lib/autocomplete';
import QuestionnairesDetails from '../../QuestionnairesDetails'

import { TASK_TYPE as T } from '../../../common/lib/model/builders'
import OPERATOR_NAME from '../../../common/lib/model/OperatorNames'
import PARAMETER_NAME from '../../../common/lib/model/ParameterNames'
import ROLE_NAME from '../../../common/lib/model/RoleNames'

import { stringTypeToSymbol } from '../../GraphEditor/Utils'

import styles from './styles.scss'
import {getAllQuestionnaires} from "../../QuestionnairesList/Actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllProperties} from "../../GameEditor/Actions";

const TooltipedAvatar = Tooltip(Avatar)

const formLabel = defineMessages({
    condition : {
        id : 'games.editor.taskDialog.form.inputs.labels.condition',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - Condition',
        defaultMessage : 'Condition Value'
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
})
const values = defineMessages({
    initialTaskName: {
        id : 'games.editor.taskDialog.form.inputs.values.name.initial',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Values - Name - Initial Task',
        defaultMessage : 'Initial Task'
    },
    lastTaskName: {
        id : 'games.editor.taskDialog.form.inputs.values.name.last',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Values - Name - Last Task',
        defaultMessage : 'Last Task'
    },
    noTask: {
        id : 'games.editor.taskDialog.noTask',
        description : 'Graph editor - Tasks Dialog - No Task',
        defaultMessage : 'No task selected'
    }
})
const actionLabel = defineMessages({
    delete : {
        id : 'games.editor.taskDialog.form.buttons.delete',
        description : 'Graph editor - Tasks Dialog - Form Buttons - Delete Task',
        defaultMessage : 'Delete Task'
    },
    save : {
        id : 'games.editor.taskDialog.form.buttons.save',
        description : 'Graph editor - Tasks Dialog - Form Buttons - Save Task',
        defaultMessage : 'Save Task'
    },
});

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles, {allowMultiple: true})
@autobind class TaskDialog extends Component{
    constructor(props){
        super(props);

        this.state = {
            modified: false,
            questionnaires: [],
            conditions: [],
            tagsAllowed: [],
            showDialog: false,
            showQuestionnaire: false,
            task : {
                name: '',
                description: '',
                operator: '',
                parameters: {},
                rolesAllowed: [],
                initialDate: null,
                endingDate: null,
                isTransitable: false,
                isRequired: true,
                isDisabled: false,
                conditions: [],
                x: null,
                y: null,
                ...props.selectedTask
            },
            ui: {
                showError: true
            },
            label: "▾",
            selectedQuestionnaire: ''
        }
    }

    static defaultProps = {
        saveEdge : () => {},
        saveTask : () => {},
        deleteTask : () => {},
        toggleTaskDialog : () => {}
    };

    comparators = [
        { value: 'lt', label: '<' },
        { value: 'gt', label: '>'},
        { value: 'ge', label: '>='},
        { value: 'le', label: '<='},
        { value: 'e', label: '='},
        { value: 'n', label: '!='}
    ];

    componentWillUpdate(props, state){
        if(props.selectedTask === null && state.modified && this.isValid() ) {
            if (confirm('Do you want to save?')) {
                this.props.saveTask(this.state.task)
            }
            this.setState({modified: false});
        }
    }

    componentWillMount(){
        this.props.getAllQuestionnaires();
        this.props.getAllProperties();
    }

    componentWillReceiveProps(props){
        if(props.questionnaires !== null && props.questionnaires !== this.props.questionnaires){
            const newQuestionnaires = {};
            props.questionnaires.map(
                (questionnaire) => {
                    newQuestionnaires[questionnaire.uri] = questionnaire.name.stringValue
                }
            );

            this.setState(prevState => {
                return {
                    ...prevState,
                    questionnaires: newQuestionnaires
            }});
        } else if(props.selectedTask !== null && props.selectedTask !== this.props.selectedTask){
            this.setState({
                task: {
                    name: '',
                    description: '',
                    mandatory: false,
                    operator: '',
                    parameters: {},
                    rolesAllowed: [],
                    isRequired: true,
                    conditions: [],
                    x: null,
                    y: null,
                    ...props.selectedTask
                }
            })
        }
        if(props.properties !== null && props.properties !== this.props.properties){
            this.state.conditions = props.properties.map(
                (property) => {
                    return {value: property.uri, label: property.displayName}
                }
            );
        }
    }

    isValid(){
        /*switch(stringTypeToSymbol(this.props.selectedTask.type)){
         case T.INITIAL_TASK:
         return
         case T.LAST_TASK:
         return
         case T.AUTOMATIC_TASK:
         return
         case T.USER_TASK:
         return this.isValidUserTask()
         }*/
        return true
    }
    isValidUserTask(){
        let { name, operator, parameters, rolesAllowed } = this.state.task

        return name !== ''
            && operator !== ''
            && Object.entries(parameters).length >= this.props.operators
                .filter(({name}) => name === operator)[0]
                .parameter.filter(({isMandatory}) => isMandatory).length
            && rolesAllowed.length > 0
    }

    handleNameChange(value){
        this.setState(prevState => ({task: {...prevState.task, name: value}, modified: true}))
    }
    handleConditionChange(value, index){
        let conditions = this.state.task.conditions;
        conditions[index].condition = value;

        this.setState(prevState => ({task: {...prevState.task, conditions: conditions}, modified: true}))
    }
    handleConditionValueChange(value, index){
        let conditions = this.state.task.conditions;
        conditions[index].conditionValue = value;

        this.setState(prevState => ({task: {...prevState.task, conditions: conditions}, modified: true}))
    }
    handleToggleDialog(value){
        this.setState(prevState => ({...prevState, showDialog: !this.state.showDialog}))
    }
    handleDescriptionChange(value){
        this.setState(prevState => ({task: {...prevState.task, description: value}, modified: true}))
    }
    handleOperatorChange(value){
        this.setState(
            prevState => ({task: {...prevState.task, operator: value}, modified: true}),
            () => {
                if(value === "http://citius.usc.es/hmb/questionnaires/operators/do_quest")
                    this.props.getAllQuestionnaires();
            }
        )
    }
    handleRolesChange(value, rol){
        if(value && rol === 'all')
            this.setState(prevState => ({
                task: {
                    ...prevState.task,
                    rolesAllowed: this.props.roles.map((rol) => rol.uri)
                },
                modified: true
            }))
        else if (value)
            this.setState(prevState => ({task: {...prevState.task, rolesAllowed: [...prevState.task.rolesAllowed, rol]}, modified: true}))
        else if (rol === 'all')
            this.setState(prevState => ({task: {...prevState.task, rolesAllowed: []}, modified: true}))
        else
            this.setState(prevState => ({task: {...prevState.task, rolesAllowed: prevState.task.rolesAllowed.filter((r) => r !== rol)}, modified: true}))

    }

    handleParameterValueChange(parameter, value){
        let { operators } = this.props;

        let operator = operators.find(({uri}) => uri === this.state.task.operator);
        let parameterObject = operator.parameter.find(({name}) => name === parameter);

        if (value !== '' && value !== null) {
            this.setState(prevState => ({
                task: {
                    ...prevState.task,
                    parameters: {...prevState.task.parameters, [parameter]: {
                        value: value, parameter: parameterObject
                    }}
                }, modified: true, showQuestionnaire: true, selectedQuestionnaire: value
            }))
        }
        else {
            let parameters = delete {...this.state.parameters}[parameter];
            this.setState(prevState => ({task: {...prevState.task, parameters}, modified: true, showQuestionnaire: false}))
        }
    }
    handleInitialDateChange(value){
        this.setState(prevState => ({task: {...prevState.task, initialDate: value}, modified: true}))
    }
    handleEndingDateChange(value){
        this.setState(prevState => ({task: {...prevState.task, endingDate: value}, modified: true}))
    }
    handleIsTransitableChange(value){
        this.setState(prevState => ({task: {...prevState.task, isTransitable: value}, modified: true}))
    }
    handleIsRequiredChange(value){
        this.setState(prevState => ({task: {...prevState.task, isRequired: value}, modified: true}))
    }
    handleIsDisabledChange(value){
        this.setState(prevState => ({task: {...prevState.task, isDisabled: value}, modified: true}))
    }

    handleSaveTaskClick(){
        this.setState({modified: false});
        this.props.saveTask(this.state.task)
    }
    handleSaveEdgeClick(){
        this.setState({modified: false});
        this.props.saveEdge(this.state.task)
    }
    handleDeleteTaskClick(){
        this.setState({
            task: {
                name: '',
                description: '',
                mandatory: false,
                operator: '',
                parameters: {},
                rolesAllowed: [],
            },
            modified: false,
        });
        this.props.deleteTask(this.props.selectedTask)
    }

    getLocalizedOperatorNameFromId(id){
        let {intl: {formatMessage}} = this.props;

        return (OPERATOR_NAME[id] && formatMessage(OPERATOR_NAME[id])) || id
    }
    getLocalizedParameterNameFromId(id){
        let {intl: {formatMessage}} = this.props

        return (PARAMETER_NAME[id] && formatMessage(PARAMETER_NAME[id])) || id
    }
    getLocalizedRoleNameFromId(id){
        let {intl: {formatMessage}, roles} = this.props;

        if(id === 'all'){
            return "All"
        } else {
            return roles.find(({uri}) => uri === id).displayName
        }
    }

    renderUserTaskDialog(){
        let { intl: {formatMessage}} = this.props;

        return (
            <CardText styleName='inputs'>
                <div>
                    <Input
                        type='text'
                        label = { formatMessage(formLabel.name) }
                        value = { this.state.task.name }
                        onChange = { this.handleNameChange }
                    />
                    <Input
                        type='text'
                        label = { formatMessage(formLabel.description) }
                        value = { this.state.task.description }
                        onChange = { this.handleDescriptionChange }
                        multiline
                    />
                    <section styleName = 'datePicker'>
                        <DatePicker label = { formatMessage(formLabel.initialDate) }
                                    locale = { this.props.language }
                                    value = { this.state.task.initialDate }
                                    maxDate = { this.state.task.endingDate }
                                    onChange = { this.handleInitialDateChange }
                                    autoOk
                        />
                        <DatePicker label = { formatMessage(formLabel.endingDate) }
                                    locale = { this.props.language }
                                    value = { this.state.task.endingDate }
                                    minDate = { this.state.task.initialDate }
                                    onChange = { this.handleEndingDateChange }
                                    autoOk
                        />
                    </section>
                    { this.renderRolesSelector() }
                </div>

                <div styleName="marginBottom">
                    <CardText styleName = 'checkbox'>
                        <Checkbox checked = { this.state.task.isRequired }
                                  label = { formatMessage(formLabel.isRequired) }
                                  onChange = { this.handleIsRequiredChange } />
                        <Checkbox checked = { this.state.task.isDisabled }
                                  label = { formatMessage(formLabel.isDisabled) }
                                  onChange = { this.handleIsDisabledChange } />
                    </CardText>
                    <Dropdown
                        auto
                        onChange = { this.handleOperatorChange }
                        source = { this.props.operators
                            .filter(({name}) => name !== 'start' && name !== 'finish')
                            .map(operator => ({value: operator.uri, label: operator.name}))
                        }
                        label = { formatMessage(formLabel.operator) }
                        value = { this.state.task.operator }
                    />
                    { this.renderFormInputsForOperatorParameters()}
                </div>

            </CardText>

        )
    }

    renderRolesSelector(){
        let { roles } = this.props

        return <section styleName = 'multiSelector roles' >
            <h1>
                <FormattedMessage
                    id = 'games.editor.taskDialog.form.inputs.labels.roles'
                    defaultMessage = 'Roles allowed'
                    description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Roles'
                />
                {
                    this.state.task.rolesAllowed.length < roles.length &&
                    <IconMenu styleName='rolesSelector' icon='add' position='auto' menuRipple = {false}>
                        {
                            roles
                                .filter(rol => !this.state.task.rolesAllowed.includes(rol.uri))
                                .map(({uri, displayName}) =>
                                    <MenuItem key = { uri }
                                              caption = { displayName }
                                              onClick = { () => this.handleRolesChange(true, uri) }/>
                                )
                        }

                        <MenuItem key = 'all_roles'
                                  caption = { 'All' }
                                  onClick = { () => this.handleRolesChange(true, 'all') }/>
                    </IconMenu>
                }
            </h1>

            <section>
                {
                    this.state.task.rolesAllowed.length === 0 &&
                    <FormattedMessage
                        id = 'games.editor.taskDialog.form.inputs.values.roles.none'
                        description = 'Graph editor - Tasks Dialog - Form Inputs - Values - Roles - If none selected all autorized'
                        defaultMessage = 'If none selected all roles will be allowed'
                    />
                }
                {
                    this.state.task.rolesAllowed.length === roles.length
                        ?
                        <Chip
                            key = { `all-chip` }
                            deletable
                            onDeleteClick={() => this.handleRolesChange(false, 'all')}>
                            { this.getLocalizedRoleNameFromId('all') }
                        </Chip>
                        :
                        this.state.task.rolesAllowed.map((id) =>
                            <Chip
                                key = { `${id}-chip` }
                                deletable
                                onDeleteClick={() => this.handleRolesChange(false, {id})}>
                                { this.getLocalizedRoleNameFromId(id) }
                            </Chip>
                        )
                }
            </section>
        </section>
    }
    renderFormActionsForTask(){
        let { selectedTask, intl: {formatMessage}} = this.props
        if(selectedTask !== null){
            switch(stringTypeToSymbol(selectedTask.type)){
                case T.LAST_TASK:
                case T.INITIAL_TASK:
                case T.AUTOMATIC_CHOICE:
                case T.AND_SPLIT:
                case T.USER_CHOICE:
                    return (
                        <CardActions>
                            <Button
                                styleName = 'fullWidth'
                                label = { formatMessage(actionLabel.delete) }
                                onClick = { this.handleDeleteTaskClick }
                                raised
                                accent
                            />
                            <Button
                                styleName = 'fullWidth'
                                label = { formatMessage(actionLabel.save) }
                                onClick = { this.handleSaveEdgeClick }
                                disabled = { !(this.isValid() && this.state.modified) }
                                raised
                                accent
                            />
                        </CardActions>
                    );
                default:
                    return (
                        <CardActions>
                            <Button
                                styleName = 'fullWidth'
                                label = { formatMessage(actionLabel.delete) }
                                onClick = { this.handleDeleteTaskClick }
                                raised
                                accent
                            />
                            <Button
                                styleName = 'fullWidth'
                                label = { formatMessage(actionLabel.save) }
                                onClick = { this.handleSaveTaskClick }
                                disabled = { !(this.isValid() && this.state.modified) }
                                raised
                                accent
                            />
                        </CardActions>
                    )
            }
        } else {
            return <CardActions>
                <Button
                    styleName = 'fullWidth'
                    label = { formatMessage(actionLabel.delete) }
                    onClick = { this.handleDeleteTaskClick }
                    disabled={ true }
                    raised
                    accent
                />
                <Button
                    styleName = 'fullWidth'
                    label = { formatMessage(actionLabel.save) }
                    onClick = { this.handleSaveEdgeClick }
                    disabled={ true }
                    raised
                    accent
                />
            </CardActions>
        }

    }
    renderFormInputsForOperatorParameters(){
        let { operators } = this.props;

        let o = (this.state.task.operator)? this.state.task.operator : null
        let operator = operators.filter(({uri}) => uri === o)[0]

        if (operator !== undefined && Array.isArray(operator.parameter) && operator.parameter.length > 0){
            return (
                <section styleName = 'multiSelector tags'>
                    <h1>
                        <FormattedMessage
                            id = 'games.editor.taskDialog.form.inputs.labels.parameters'
                            description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Parameters'
                            defaultMessage = '{parametersCount, plural, one {Parameter} other {Parameters}}'
                            values = {{parametersCount: operator.parameter.length}}
                        />
                    </h1>
                    <section>
                        {
                            operator.parameter.map(({ name, type, mType }) => {
                                if(type === "Questionnaire.URI") {
                                    return (
                                        <div key={ name + "_div" } styleName='questionnaire'>
                                            <Autocomplete
                                                styleName="autocomplete"
                                                key={ name + "_autocomplete" }
                                                label="Choose a questionnaire"
                                                suggestionMatch='anywhere'
                                                multiple={false}
                                                onChange={value => this.handleParameterValueChange(name, value)}
                                                source={this.state.questionnaires}
                                                value = { this.state.task.parameters[name]? this.state.task.parameters[name].value : '' }
                                            />
                                            <IconButton
                                                styleName="displayQuestionnaire" icon='assignment'
                                                disabled={!this.state.showQuestionnaire}
                                                onClick={ this.handleToggleDialog }
                                                accent
                                            />
                                            <QuestionnairesDetails
                                                active={this.state.showDialog}
                                                questionnaireUri={this.state.selectedQuestionnaire}
                                                onCancel={this.handleToggleDialog}
                                            />
                                        </div>
                                    )
                                } else if(type === "Task.URI") {
                                    return (
                                        <div key={ name + "_div" } styleName='questionnaire'>
                                            <Input
                                                styleName="autocomplete"
                                                disabled={true}
                                                key={ name + "_input" }
                                                label="Task Id"
                                                value = { this.state.task.id || '' }
                                            />
                                        </div>
                                    )
                                } else if (mType){
                                    switch(mType.split('#')[1]){
                                        case 'StringType':
                                            return <Input key = { name }
                                                          label = { this.getLocalizedParameterNameFromId(name) }
                                                          value = { this.state.task.parameters[name] || '' }
                                                          onChange = { value => this.handleParameterValueChange(name, value) } />
                                        case 'IntegerType':
                                            return <Input key = { name }
                                                          type = 'number'
                                                          step = { 1 }
                                                          label = { this.getLocalizedParameterNameFromId(name) }
                                                          value = { this.state.task.parameters[name] || '' }
                                                          onChange = { value => this.handleParameterValueChange(name, value) } />
                                        case 'FloatType':
                                            return <Input key = { name }
                                                          type = 'number'
                                                          step = { 1 }
                                                          label = { this.getLocalizedParameterNameFromId(name) }
                                                          value = { this.state.task.parameters[name] || '' }
                                                          onChange = { value => this.handleParameterValueChange(name, value) } />
                                        case 'BooleanType':
                                            return <Checkbox key = { name }
                                                             label = { this.getLocalizedParameterNameFromId(name) }
                                                             checked = { this.state.task.parameters[name] || '' }
                                                             onChange = { value => this.handleParameterValueChange(name, value) } />
                                        case 'DateType':
                                            return <DatePicker key = { name }
                                                               label = { this.getLocalizedParameterNameFromId(name) }
                                                               value = { this.state.task.parameters[name] || '' }
                                                               onChange = { value => this.handleParameterValueChange(name, value) } />
                                        default:
                                            return <span key = { name }>
                                            Parameter type [{ mType.split('#')[1].toUpperCase() }] not suported yet
                                        </span>
                                    }
                                }
                            })
                        }
                    </section>
                </section>
            )
        }
    }

    handleToggleTaskDialog(){
        this.props.toggleTaskDialog();
        if(this.state.label === "▾") this.setState(prevState => ({label: "▴"}))
        else this.setState(prevState => ({label: "▾"}))
    }

    handleComparatorChange(value, index){
        let conditions = this.state.task.conditions;
        conditions[index].comparator = value;

        this.setState(prevState => ({...prevState, task: {...prevState.task, conditions: conditions}}));
    }

    renderConditionType(cond, index){
        let { intl: {formatMessage}} = this.props;

        if(this.props.properties.find(({uri}) => uri === cond.condition).type === "http://citius.usc.es/hmb/wfontology.owl#IntegerType"){
            return <div>
                <Dropdown
                    source={this.comparators}
                    onChange={(value) => this.handleComparatorChange(value, index)}
                    value={cond.comparator}
                />
                <Input
                    label = { formatMessage(formLabel.condition) }
                    value = { cond.conditionValue }
                    onChange = { (value) => this.handleConditionValueChange(value, index) }
                />
            </div>
        } else{
            return null
        }
    }

    renderFormInputsForTask(){
        let { selectedTask, intl: {formatMessage}} = this.props;

        if( selectedTask != null){
            switch(stringTypeToSymbol(selectedTask.type)){
                case T.INITIAL_TASK:
                    return (
                        <CardText styleName='inputs'>
                            <Input
                                label = { formatMessage(formLabel.name) }
                                value = { formatMessage(values.initialTaskName) }
                                disabled
                            />
                        </CardText>
                    );
                case T.LAST_TASK:
                    return (
                        <CardText styleName='inputs'>
                            <Input
                                label = { formatMessage(formLabel.name) }
                                value = { formatMessage(values.lastTaskName) }
                                disabled
                            />
                        </CardText>
                    );
                case T.LOOP:
                    return (
                        <CardText styleName='inputs'>
                            <p>Path 0 Condition:</p>
                            <div>
                                <Dropdown
                                    source={this.state.conditions}
                                    onChange={(value) => this.handleConditionChange(value, 0)}
                                    value={this.state.task.conditions[0].condition}
                                />
                                {
                                    this.state.task.conditions[0].condition !== ''?
                                        this.renderConditionType(this.state.task.conditions[0], 0)
                                        :
                                        null
                                }

                            </div>
                        </CardText>
                    );
                case T.AND_SPLIT:
                case T.AUTOMATIC_CHOICE:
                case T.USER_CHOICE:
                    return (
                        <CardText styleName = 'inputs'>
                            <Checkbox checked = { this.state.task.isTransitable }
                                      label = { formatMessage(formLabel.isTransitable) }
                                      onChange = { this.handleIsTransitableChange } />
                            <Checkbox checked = { this.state.task.isRequired }
                                      label = { formatMessage(formLabel.isRequired) }
                                      onChange = { this.handleIsRequiredChange } />
                            <Checkbox checked = { this.state.task.isDisabled }
                                      label = { formatMessage(formLabel.isDisabled) }
                                      onChange = { this.handleIsDisabledChange } />
                            {
                                this.state.task.conditions.map(
                                    (cond, index) => {
                                        return <div>
                                            <p>Path {index} Condition:</p>
                                            <div>
                                                <Dropdown
                                                    source={this.state.conditions}
                                                    onChange={(value) => this.handleConditionChange(value, index)}
                                                    value={cond.condition}
                                                />
                                                {
                                                    cond.condition !== ''?
                                                        this.renderConditionType(cond, index)
                                                        :
                                                        null
                                                }

                                            </div>

                                        </div>
                                    }
                                )
                            }
                        </CardText>
                    );
                case T.AUTOMATIC_CHOICE_END:
                case T.USER_CHOICE_END:
                case T.LOOP_END:
                case T.AND_SPLIT_END:
                    return <CardText styleName = 'inputs'>
                    </CardText>
                case T.USER_TASK:
                case T.AUTOMATIC_TASK:
                    return this.renderUserTaskDialog();
            }
        } else {
            return <CardText styleName='inputs'>
                <p>{ formatMessage(values.noTask) }</p>
            </CardText>
        }
    }

    render(){
        let {className} = this.props;

        return <Card raised className = {className} styleName = 'taskDialog'>
            <Button
                styleName='toggleButton'
                label = { this.state.label }
                onClick = { () => this.handleToggleTaskDialog() }/>
            { this.renderFormInputsForTask() }
            { this.renderFormActionsForTask() }
        </Card>
    }
}

function mapStateToProps(state) {
    return {
        questionnaires: state.QuestionnairesState.questionnaires,
        tags: state.QuestionnairesState.tags,
        roles: state.GameEditorState.present.roles,
        operators: state.GameEditorState.present.operators,
        properties: state.GameEditorState.present.properties
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllQuestionnaires: bindActionCreators(getAllQuestionnaires, dispatch),
        getAllProperties: bindActionCreators(getAllProperties, dispatch)
    }
}

export default injectIntl(TaskDialog)