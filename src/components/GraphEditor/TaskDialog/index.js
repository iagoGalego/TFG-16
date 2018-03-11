import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { autobind } from 'core-decorators'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'
import Button from 'react-toolbox/lib/button'
import Checkbox from 'react-toolbox/lib/checkbox'
import Dropdown from 'react-toolbox/lib/dropdown'
import DatePicker from 'react-toolbox/lib/date_picker'
import Chip from 'react-toolbox/lib/chip'
import Avatar from 'react-toolbox/lib/avatar'
import Tooltip from 'react-toolbox/lib/tooltip'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'

import { TASK_TYPE as T } from '../../../common/lib/model/builders'
import OPERATOR_NAME from '../../../common/lib/model/OperatorNames'
import PARAMETER_NAME from '../../../common/lib/model/ParameterNames'
import ROLE_NAME from '../../../common/lib/model/RoleNames'

import { stringTypeToSymbol } from '../../GraphEditor/Utils'

import styles from './styles.scss'

const TooltipedAvatar = Tooltip(Avatar)

const formLabel = defineMessages({
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
    giveBadge: {
        id : 'games.editor.taskDialog.form.inputs.labels.onTaskFinish.giveBadges',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - On task finish - Give badges',
        defaultMessage : 'Give badges'
    },
    givePoints: {
        id : 'games.editor.taskDialog.form.inputs.labels.onTaskFinish.givePoints',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - On task finish - Give points',
        defaultMessage : 'Give points'
    },
    numberOfPoints: {
        id : 'games.editor.taskDialog.form.inputs.labels.onTaskFinish.numberOfPoints',
        description : 'Graph editor - Tasks Dialog - Form Inputs - Labels - On task finish - Number of points',
        defaultMessage : 'Points'
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
})

@CSSModules(styles, {allowMultiple: true})
@autobind class TaskDialog extends Component{
    constructor(props){
        super(props)

        this.state = {
            modified: false,
            task : {
                name: '',
                description: '',
                operator: '',
                parameters: {},
                rolesAllowed: [],
                initialDate: null,
                endingDate: null,
                giveBadges: false,
                badges: [],
                givePoints: false,
                points: '',
                ...props.selectedTask
            },
            ui: {
                showPointsLabel: true,
                showError: true
            }
        }
    }

    static defaultProps = {
        saveTask : () => {},
        deleteTask : () => {},
    }

    componentWillUpdate(props, state){
        if(props.minimized && state.modified && this.isValid() )
            confirm('Do you want to save?')

    }
    componentWillReceiveProps(props){
        if(props.selectedTask !== null)
            this.setState({
                task: {
                    name: '',
                    description: '',
                    mandatory: false,
                    operator: '',
                    parameters: {},
                    rolesAllowed: [],
                    ...props.selectedTask
                }
            })
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

        return name != ''
            && operator != ''
            && Object.entries(parameters).length >= this.props.HMBData.operators
                .filter(({wfontology_Name}) => wfontology_Name === operator)[0]
                .parameter.filter(({isMandatory}) => isMandatory).length
            && rolesAllowed.length > 0
    }

    handleNameChange(value){
        this.setState(prevState => ({task: {...prevState.task, name: value}, modified: true}))
    }
    handleDescriptionChange(value){
        this.setState(prevState => ({task: {...prevState.task, description: value}, modified: true}))
    }
    handleOperatorChange(value){
        this.setState(prevState => ({task: {...prevState.task, operator: value}, modified: true}))
    }
    handleRolesChange(value, rol){
        if(value && rol.id === 'all')
            this.setState(prevState => ({
                task: {
                    ...prevState.task,
                    rolesAllowed: this.props.HMBData.roles.map(({wfontology_Name, displayName}) => ({
                        id: wfontology_Name,
                        name: displayName
                    }))
                },
                modified: true
            }))
        else if (value)
            this.setState(prevState => ({task: {...prevState.task, rolesAllowed: [...prevState.task.rolesAllowed, rol]}, modified: true}))
        else if (rol.id === 'all')
            this.setState(prevState => ({task: {...prevState.task, rolesAllowed: []}, modified: true}))
        else
            this.setState(prevState => ({task: {...prevState.task, rolesAllowed: prevState.task.rolesAllowed.filter(({id}) => id !== rol.id)}, modified: true}))

    }
    handleParameterValueChange(parameter, value){
        if (value !== '' && value !== null)
            this.setState(prevState => ({task: {...prevState.task, parameters: {...prevState.task.parameters, [parameter]: value}}, modified: true}))
        else {
            let parameters = delete {...this.state.parameters}[parameter]
            this.setState(prevState => ({task: {...prevState.task, parameters}, modified: true}))
        }
    }
    handleInitialDateChange(value){
        this.setState(prevState => ({task: {...prevState.task, initialDate: value}, modified: true}))
    }
    handleEndingDateChange(value){
        this.setState(prevState => ({task: {...prevState.task, endingDate: value}, modified: true}))
    }
    handleGiveBadgeChange(value){
        this.setState(prevState => ({task: {...prevState.task, giveBadge: value}, modified: true}))
    }
    handleGivePointsChange(value){
        this.setState(prevState => ({task: {...prevState.task, givePoints: value}, modified: true}))
    }
    handlePointsChange(value){
        if(value === '' || !Number.isNaN(Number.parseInt(value)) && value >= 0){
            this.setState(prevState => ({task: {...prevState.task, points: value}, modified: true}))
        }
    }

    handlePointsInputFocus(){
        this.setState(prevState => ({ui: {...prevState.ui, showPointsLabel: false}}))
    }
    handlePointsInputBlur(){
        this.setState(prevState => ({ui: {...prevState.ui, showPointsLabel: true}}))
    }

    handleSaveTaskClick(){
        this.setState({modified: false})
        this.props.saveTask(this.state.task)
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
        let {intl: {formatMessage}} = this.props

        return (OPERATOR_NAME[id] && formatMessage(OPERATOR_NAME[id])) || id
    }
    getLocalizedParameterNameFromId(id){
        let {intl: {formatMessage}} = this.props

        return (PARAMETER_NAME[id] && formatMessage(PARAMETER_NAME[id])) || id
    }
    getLocalizedRoleNameFromId(id){
        let {intl: {formatMessage}} = this.props

        let defaultRole = this.props.HMBData.roles.filter(rol => rol.wfontology_Name === id)[0]
        let defaultRoleName = ( defaultRole !== undefined && defaultRole.displayName ) || id

        return (ROLE_NAME[id] && formatMessage(ROLE_NAME[id])) || defaultRoleName
    }

    renderUserTaskDialog(){
        let { intl: {formatMessage}} = this.props

        return (
            <CardText>
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
                <section styleName = 'columns'>
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
                <section styleName = 'multiSelector'>
                    <h1>
                        <FormattedMessage
                            id = 'games.editor.taskDialog.form.inputs.labels.onTaskFinish'
                            defaultMessage = 'On task finish'
                            description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - On task finish'
                        />
                    </h1>

                    <div styleName='columns'>
                        <Checkbox checked = { this.state.task.giveBadge }
                                  label = { formatMessage(formLabel.giveBadge) }
                                  onChange={ this.handleGiveBadgeChange } />

                        <div styleName = 'badges'>
                            <TooltipedAvatar tooltip = 'tooltip'
                                             tooltipPosition = 'bottom'
                                             icon='folder'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip2'
                                             tooltipPosition = 'bottom'
                                             icon='build'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip3'
                                             tooltipPosition = 'bottom'
                                             icon='explore'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip'
                                             tooltipPosition = 'bottom'
                                             icon='folder'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip2'
                                             tooltipPosition = 'bottom'
                                             icon='build'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip3'
                                             tooltipPosition = 'bottom'
                                             icon='explore'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip'
                                             tooltipPosition = 'bottom'
                                             icon='folder'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip2'
                                             tooltipPosition = 'bottom'
                                             icon='build'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip3'
                                             tooltipPosition = 'bottom'
                                             icon='explore'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip'
                                             tooltipPosition = 'bottom'
                                             icon='folder'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip2'
                                             tooltipPosition = 'bottom'
                                             icon='build'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                            <TooltipedAvatar tooltip = 'tooltip3'
                                             tooltipPosition = 'bottom'
                                             icon='explore'
                                             style={{backgroundColor: `#${parseInt(Math.random() * 16777215).toString(16)}`}}/>
                        </div>

                    </div>
                    <div styleName='columns'>
                        <Checkbox checked = { this.state.task.givePoints }
                                  label = { formatMessage(formLabel.givePoints) }
                                  onChange = { this.handleGivePointsChange } />

                        <Input styleName = 'noPadding noMargin'
                               label = { !this.state.task.points && this.state.ui.showPointsLabel && formatMessage(formLabel.numberOfPoints) || ''}
                               hint = { formatMessage(formLabel.numberOfPoints) }
                               disabled = { !this.state.task.givePoints }
                               onChange = { this.handlePointsChange }
                               onFocus = { this.handlePointsInputFocus }
                               onBlur = { this.handlePointsInputBlur }
                               value = { this.state.task.points } />
                    </div>

                </section>

                <Dropdown
                    auto
                    onChange = { this.handleOperatorChange }
                    source = { this.props.HMBData.operators
                                .filter(({wfontology_Name}) => wfontology_Name !== 'start' && wfontology_Name !== 'finish')
                                .map(operator => ({value: operator.wfontology_Name, label: this.getLocalizedOperatorNameFromId(operator.wfontology_Name)}))
                            }
                    label = { formatMessage(formLabel.operator) }
                    value = { this.state.task.operator }
                />
                { this.renderRolesSelector() }
            </CardText>
        )
    }

    renderRolesSelector(){
        let { HMBData } = this.props

        return <section styleName = 'multiSelector roles' >
            <h1>
                <FormattedMessage
                    id = 'games.editor.taskDialog.form.inputs.labels.roles'
                    defaultMessage = 'Roles allowed'
                    description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Roles'
                />
                {
                    this.state.task.rolesAllowed.length < HMBData.roles.length &&
                    <IconMenu styleName='rolesSelector' icon='add' position='auto' menuRipple = {false}>
                        {
                            HMBData.roles
                                .filter(rol => !this.state.task.rolesAllowed.map(rol => rol.id).includes(rol.wfontology_Name))
                                .map(({wfontology_Name, displayName}) =>
                                    <MenuItem key = { wfontology_Name }
                                              caption = { this.getLocalizedRoleNameFromId(wfontology_Name) }
                                              onClick = { () => this.handleRolesChange(true, {id: wfontology_Name, name: displayName}) }/>
                                )
                        }

                        <MenuItem key = 'all_roles'
                                  caption = { this.getLocalizedRoleNameFromId('all') }
                                  onClick = { () => this.handleRolesChange(true, {id: 'all', name: this.getLocalizedRoleNameFromId('all')}) }/>
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
                    this.state.task.rolesAllowed.length === HMBData.roles.length
                        ?
                        <Chip
                            key = { `all-chip` }
                            deletable
                            onDeleteClick={() => this.handleRolesChange(false, {id: 'all'})}>
                            { this.getLocalizedRoleNameFromId('all') }
                        </Chip>
                        :
                        this.state.task.rolesAllowed.map(({id, name}) =>
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

        switch(stringTypeToSymbol(selectedTask.type)){
            case T.LAST_TASK:
            case T.INITIAL_TASK:
                return
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
    }
    renderFormInputsForOperatorParameters(){
        let operator = this.props.HMBData.operators.filter(({wfontology_Name}) => wfontology_Name === this.state.task.operator)[0]

        if (operator !== undefined && Array.isArray(operator.parameter) && operator.parameter.length > 0)
            return (
                <div className = { styles.multiSelector }>
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
                            operator.parameter.map(({ wfontology_Name, wfontology_Type }) => {
                                switch(wfontology_Type.split('#')[1]){
                                    case 'StringType':
                                        return <Input key = { wfontology_Name }
                                                      label = { this.getLocalizedParameterNameFromId(wfontology_Name) }
                                                      value = { this.state.task.parameters[wfontology_Name] || '' }
                                                      onChange = { value => this.handleParameterValueChange(wfontology_Name, value) } />
                                    case 'IntegerType':
                                        return <Input key = { wfontology_Name }
                                                      type = 'number'
                                                      step = { 1 }
                                                      label = { this.getLocalizedParameterNameFromId(wfontology_Name) }
                                                      value = { this.state.task.parameters[wfontology_Name] || '' }
                                                      onChange = { value => this.handleParameterValueChange(wfontology_Name, value) } />
                                    case 'FloatType':
                                        return <Input key = { wfontology_Name }
                                                      type = 'number'
                                                      step = { 1 }
                                                      label = { this.getLocalizedParameterNameFromId(wfontology_Name) }
                                                      value = { this.state.task.parameters[wfontology_Name] || '' }
                                                      onChange = { value => this.handleParameterValueChange(wfontology_Name, value) } />
                                    case 'BooleanType':
                                        return <Checkbox key = { wfontology_Name }
                                                         label = { this.getLocalizedParameterNameFromId(wfontology_Name) }
                                                         checked = { this.state.task.parameters[wfontology_Name] || '' }
                                                         onChange = { value => this.handleParameterValueChange(wfontology_Name, value) } />
                                    case 'DateType':
                                        //TODO fix locale
                                        return <DatePicker key = { wfontology_Name }
                                                           label = { this.getLocalizedParameterNameFromId(wfontology_Name) }
                                                           value = { this.state.task.parameters[wfontology_Name] || '' }
                                                           onChange = { value => this.handleParameterValueChange(wfontology_Name, value) } />
                                    default:
                                        return <span key = { wfontology_Name }>
                                            Parameter type [{ wfontology_Type.split('#')[1].toUpperCase() }] not suported yet
                                        </span>
                                }
                            })
                        }
                    </section>
                </div>
            )
    }
    renderFormInputsForTask(){
        let { selectedTask, intl: {formatMessage}} = this.props
        switch(stringTypeToSymbol(selectedTask.type)){
            case T.INITIAL_TASK:
                return (
                    <CardText>
                        <Input
                            label = { formatMessage(formLabel.name) }
                            value = { formatMessage(values.initialTaskName) }
                            disabled
                        />
                    </CardText>
                )
            case T.LAST_TASK:
                return (
                    <CardText>
                        <Input
                            label = { formatMessage(formLabel.name) }
                            value = { formatMessage(values.lastTaskName) }
                            disabled
                        />
                    </CardText>
                )
            case T.AUTOMATIC_TASK:
                return (
                    <CardText>
                        <Input
                            label = { formatMessage(formLabel.name) }
                            value = { name }
                        />
                    </CardText>
                )
            case T.USER_TASK:
                return this.renderUserTaskDialog()
        }
    }

    render(){
        let {className, minimized} = this.props

        if (!minimized)
            return <Card raised className = {className} styleName = 'taskDialog'>
                { this.renderFormInputsForTask() }
                { this.renderFormActionsForTask() }
            </Card>
    }
}

export default injectIntl(TaskDialog)