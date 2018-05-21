import React, {Component} from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import CSSModules from 'react-css-modules'
import { autobind } from 'core-decorators'

import Toolbar from '../GraphEditor/Toolbar'
import Editor from '../GraphEditor/Editor'
import TaskDialog from '../GraphEditor/TaskDialog'
import {bindActionCreators} from "redux";
import {setTitle} from "../Layout/Actions";
import {connect} from "react-redux";
import styles from './styles.scss'
import image from './img/warning.svg'
import ReactDOM from "react-dom";
import {DateType, Metadata, SequenceFlow, WorkflowTranslation, WorkflowTrigger} from "../../common/lib/model";
import Translator from "../../common/lib/model/translator";
import HMBAPI from "../../common/lib/API";
import PropTypes from "prop-types";

const messages = defineMessages({
    title : {
        id : 'games.editor.title',
        description : 'Game Editor page title',
        defaultMessage : 'Game editor'
    }
});

@connect(() => {return {}}, (dispatch) => {return {setAppTitle: bindActionCreators(setTitle, dispatch)}})
@CSSModules(styles)
@autobind class GameEditor extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            windowWidth: window.innerWidth,
            scale: 0.8,
            showHelp: false,
            fullScreen: false
        };
        this.__full = null
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    static defaultProps = {
        saveTask: () => alert('Not implemented yet'),
        deleteTask: () => alert('Not implemented yet'),
        addTask: () => alert('Not implemented yet'),
        selectTask: () => alert('Not implemented yet'),
        HMBData: {
            operators: [
                {
                    "@class": "es.usc.citius.hmb.model.Operator",
                    "isLoaded": true,
                    "description": "Gestiona la ejecucion del cuestionario X",
                    "parameter": [
                        {
                            "@class": "es.usc.citius.hmb.model.Parameter",
                            "isLoaded": true,
                            "isMandatory": true,
                            "name": "taskId",
                            "mType": "http://citius.usc.es/hmb/questionnaires.owl#StringType",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#TaskId"
                        }
                    ],
                    "provider": "es.usc.citius.hmb.questionnaires",
                    "name": "manageTask",
                    "readsProperty": [],
                    "evaluatesProperty": [],
                    "ruleReference": null,
                    "writesProperty": [
                        {
                            "@class": "es.usc.citius.hmb.model.MultiValueProperty",
                            "isLoaded": true,
                            "metadata": [],
                            "provider": "es.usc.citius.hmb.questionnaires",
                            "propertyContext": {
                                "@class": "es.usc.citius.hmb.model.PropertyContext",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#LocalPropertyContext"
                            },
                            "propertySource": {
                                "@class": "es.usc.citius.hmb.model.PropertySource",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#UserInputPropertySource"
                            },
                            "isAvailableForRules": true,
                            "aggregationOperator": "",
                            "tagReference": [],
                            "name": "aborted_tasks",
                            "mType": "http://citius.usc.es/hmb/wfontology.owl#StringType",
                            "displayDescription": "ID de las tareas abortadas por el admin",
                            "displayName": "Tareas abortadas por el admin",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#AbortedTasks"
                        },
                        {
                            "@class": "es.usc.citius.hmb.model.MultiValueProperty",
                            "isLoaded": true,
                            "metadata": [],
                            "provider": "es.usc.citius.hmb.questionnaires",
                            "propertyContext": {
                                "@class": "es.usc.citius.hmb.model.PropertyContext",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#LocalPropertyContext"
                            },
                            "propertySource": {
                                "@class": "es.usc.citius.hmb.model.PropertySource",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#UserInputPropertySource"
                            },
                            "isAvailableForRules": true,
                            "aggregationOperator": "",
                            "tagReference": [],
                            "name": "active_tasks",
                            "mype": "http://citius.usc.es/hmb/wfontology.owl#StringType",
                            "displayDescription": "ID de las tareas activas",
                            "displayName": "Tareas activas",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#ActiveTasks"
                        },
                        {
                            "@class": "es.usc.citius.hmb.model.MultiValueProperty",
                            "isLoaded": true,
                            "metadata": [],
                            "provider": "es.usc.citius.hmb.questionnaires",
                            "propertyContext": {
                                "@class": "es.usc.citius.hmb.model.PropertyContext",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#LocalPropertyContext"
                            },
                            "propertySource": {
                                "@class": "es.usc.citius.hmb.model.PropertySource",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#UserInputPropertySource"
                            },
                            "isAvailableForRules": true,
                            "aggregationOperator": "",
                            "tagReference": [],
                            "name": "skipped_tasks",
                            "mType": "http://citius.usc.es/hmb/wfontology.owl#StringType",
                            "displayDescription": "ID de las tareas saltadas por el admin",
                            "displayName": "Tareas saltadas por el admin",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#SkipedTasks"
                        }
                    ],
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#ManageQuestionnaireOperator"
                }, {
                    "@class": "es.usc.citius.hmb.model.Operator",
                    "isLoaded": true,
                    "description": null,
                    "parameter": [
                        {
                            "@class": "es.usc.citius.hmb.model.Parameter",
                            "isLoaded": true,
                            "isMandatory": true,
                            "name": "taskId",
                            "mType": "http://citius.usc.es/hmb/questionnaires.owl#StringType",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#TaskId"
                        }
                    ],
                    "provider": "es.usc.citius.hmb.questionnaires",
                    "name": "finish",
                    "readsProperty": [],
                    "evaluatesProperty": [],
                    "ruleReference": null,
                    "writesProperty": [],
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#CaseExecutionFinishOperator"
                },
                {
                    "@class": "es.usc.citius.hmb.model.Operator",
                    "isLoaded": true,
                    "description": "Responde a las preguntas del cuestionario",
                    "parameter": [
                        {
                            "@class": "es.usc.citius.hmb.model.Parameter",
                            "isLoaded": true,
                            "isMandatory": true,
                            "name": "questionnaire",
                            "mType": "http://citius.usc.es/hmb/questionnaires.owl#Questionnaire",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#Pa_Questionnaire"
                        }
                    ],
                    "provider": "es.usc.citius.hmb.questionnaires",
                    "name": "questionnaire",
                    "readsProperty": [],
                    "evaluatesProperty": [],
                    "ruleReference": null,
                    "writesProperty": [
                        {
                            "@class": "es.usc.citius.hmb.model.SingleValueProperty",
                            "isLoaded": true,
                            "metadata": [],
                            "provider": "es.usc.citius.hmb.questionnaires",
                            "propertyContext": {
                                "@class": "es.usc.citius.hmb.model.PropertyContext",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#LocalCasePropertyContext"
                            },
                            "propertySource": {
                                "@class": "es.usc.citius.hmb.model.PropertySource",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#UserInputPropertySource"
                            },
                            "isAvailableForRules": true,
                            "aggregationOperator": "",
                            "tagReference": [],
                            "name": "quest_answer",
                            "mType": "http://citius.usc.es/hmb/questionnaires.owl#QuestionnaireAnswer",
                            "displayDescription": null,
                            "displayName": "Respuesta a cuestionario",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#QuestAnswer"
                        },
                        {
                            "@class": "es.usc.citius.hmb.model.MultiValueProperty",
                            "isLoaded": true,
                            "metadata": [],
                            "provider": "es.usc.citius.hmb.questionnaires",
                            "propertyContext": {
                                "@class": "es.usc.citius.hmb.model.PropertyContext",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#GlobalResourcePropertyContext"
                            },
                            "propertySource": {
                                "@class": "es.usc.citius.hmb.model.PropertySource",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#UserInputPropertySource"
                            },
                            "isAvailableForRules": true,
                            "aggregationOperator": "",
                            "tagReference": [],
                            "name": "questionnaire_history",
                            "mType": "http://citius.usc.es/hmb/questionnaires.owl#HistoryEntry",
                            "displayDescription": "Historial de cuestionarios",
                            "displayName": "Historial de cuestionarios",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#QuestionnaireHistory"
                        },
                        {
                            "@class": "es.usc.citius.hmb.model.SingleValueProperty",
                            "isLoaded": true,
                            "metadata": [],
                            "provider": "es.usc.citius.hmb.questionnaires",
                            "propertyContext": {
                                "@class": "es.usc.citius.hmb.model.PropertyContext",
                                "isLoaded": true,
                                "uri": "http://citius.usc.es/hmb/wfontology.owl#LocalCasePropertyContext"
                            },
                            "propertySource": null,
                            "isAvailableForRules": true,
                            "aggregationOperator": "",
                            "tagReference": [],
                            "name": "quest_ok",
                            "mType": "http://citius.usc.es/hmb/wfontology.owl#BooleanType",
                            "displayDescription": "Cuestionario respondido correctamente",
                            "displayName": "Cuestionario respondido correctamente",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#QuestOK"
                        }
                    ],
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#QuestionnaireOperator"
                },
                {
                    "@class": "es.usc.citius.hmb.model.Operator",
                    "isLoaded": true,
                    "description": null,
                    "parameter": [
                        {
                            "@class": "es.usc.citius.hmb.model.Parameter",
                            "isLoaded": true,
                            "isMandatory": true,
                            "name": "taskId",
                            "mType": "http://citius.usc.es/hmb/questionnaires.owl#StringType",
                            "uri": "http://citius.usc.es/hmb/questionnaires.owl#TaskId"
                        }
                    ],
                    "provider": "es.usc.citius.hmb.questionnaires",
                    "name": "start",
                    "readsProperty": [],
                    "evaluatesProperty": [],
                    "ruleReference": null,
                    "writesProperty": [],
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#CaseExecutionStartOperator"
                }],
            roles: [
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
                    "displayName": "Game administrator",
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_GameAdmin"
                },
                {
                    "@class": "es.usc.citius.hmb.model.Tag",
                    "isLoaded": true,
                    "provider": null,
                    "user": [],
                    "name": "admin",
                    "isSubTagOf": [],
                    "displayName": "Administrator",
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
                    "displayName": "User",
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
                    "displayName": "User administrator",
                    "uri": "http://citius.usc.es/hmb/questionnaires.owl#Tag_UserAdmin"
                }],
            badges: [
                {
                    id: 1,
                    name: 'Medalla 1',
                    image: 'http://placekitten.com/300/300'
                }, {
                    id: 2,
                    name: 'Medalla 2',
                    image: 'http://placekitten.com/g/300/300'
                }, {
                    id: 3,
                    name: 'Medalla 3',
                    image: 'http://placekitten.com/300/300'
                }, {
                    id: 4,
                    name: 'Medalla 4',
                    image: 'http://placekitten.com/g/300/300'
                }, {
                    id: 5,
                    name: 'Medalla 5',
                    image: 'http://placekitten.com/300/300'
                }
            ]
        }
    }

    componentWillMount(){
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title))
    }

    componentDidMount() {
        if(this.props.location.pathname.split( '/' )[3] === 'editor'){
            this.props.setSelectedWorkflow(null);
        } else{
            this.props.setSelectedWorkflow(this.props.location.pathname.split( '/' )[3]);
        }
        window.addEventListener('resize', this.handleWindowResize);
        window.addEventListener('beforeunload', function (e) {
            //TODO save before leaving
        });
        document.addEventListener('fullscreenchange', this.handleExit);
        document.addEventListener('webkitfullscreenchange', this.handleExit);
        document.addEventListener('mozfullscreenchange', this.handleExit);
        document.addEventListener('MSFullscreenChange', this.handleExit);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize)
    }

    handleExit() {
        this.setState(previousState => ({...previousState, fullScreen: !this.state.fullScreen}));
    }
    handleWindowResize() {
        this.setState(previousState => ({...previousState, windowWidth: window.innerWidth}));
    }
    handleSave(payload){
        let { language } = this.props;

        let workflow = {
            executionId: 0,
            executionStatus: 0,
            isSubWorkflow: false,
            name: "",
            description: "",
            startDate: null,
            expiryDate: null,
            metadata: [],
            modificationDate: null,
            provider: "",
            translation: [],
            element: [],
            sequenceFlow: [],
            trigger: null,
            versionNumber: 0,
            isDesignFinished: false,
            isValidated: false,
            designer: ""
        };
        let metadata = payload.metadata.map(
            (m) => {
                let md = new Metadata();
                md.name = "tag";
                md.metadataValue = m.metadataValue;
                return md;
            }
        );
        HMBAPI.instance.DB.client.loggedUser.get().then(
            (response) => {
                let translation = new WorkflowTranslation();
                translation.description = payload.description;
                translation.name = payload.name;
                translation.longDescription = payload.longDescription;
                translation.languageCode = language;
                translation.imageUrl = null;
                let newWorkFlow = {
                    ...workflow,
                    uri: payload.uri,
                    translation: translation,
                    startDate: payload.startDate,
                    expiryDate: payload.expiryDate,
                    metadata: metadata,
                    modificationDate: payload.modificationDate,
                    provider: payload.provider,
                    designer: response.content
                };
                alert("graph tiene que quedar así: "+ JSON.stringify(this.props.graph));
                if(newWorkFlow.uri === ''){
                    this.props.save(Translator.toOpenetFormat({workflow: newWorkFlow, graph:this.props.graph}));
                } else {
                    this.props.edit(Translator.toOpenetFormat({workflow: newWorkFlow, graph:this.props.graph}));
                }
                //alert("cambio ruta")
                //this.context.router.history.push("/app/games");
            }
        );

    }
    handleZoom(action){
        switch (action){
            case 'in':
                this.setState(previousState => ({...previousState, scale: previousState.scale + 0.1}));
                document.dispatchEvent(new CustomEvent('graph:zoomin'));
                break;
            case 'out':
                this.setState(previousState => ({...previousState, scale: previousState.scale - 0.1}));
                document.dispatchEvent(new CustomEvent('graph:zoomout'));
                break;
            case 'reset':
                this.setState(previousState => ({...previousState, scale: 0.8}));
                document.dispatchEvent(new CustomEvent('graph:reset'));
                break;
            case 'fit':
                if(!this.state.fullScreen){
                    if(this.__full.requestFullScreen) {
                        this.__full.requestFullScreen();
                    } else if(this.__full.mozRequestFullScreen) {
                        this.__full.mozRequestFullScreen();
                    } else if(this.__full.webkitRequestFullScreen) {
                        this.__full.webkitRequestFullScreen();
                    }
                } else{
                    if(document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if(document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if(document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }
                break;
            default:
                alert(`Option '${action}' not recognized !`)
        }
    }
    handlePrint(){
        //TODO bigger canvas
        let dataUrl = document.querySelector(".src-components-GraphEditor-Editor-__graph___52RLx > div:nth-child(1) > canvas:nth-child(3)").toDataURL("image/png")
        let windowContent = '<!DOCTYPE html>';
        windowContent += '<html>'
        windowContent += '<head><title>Print Graph</title></head>';
        windowContent += '<body>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '</body>';
        windowContent += '</html>';
        let printWin = window.open('','','width=340,height=260');
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();
        printWin.focus();
        printWin.print();
        printWin.close();
    }

    handleTaskCreation(evt, type){
        document.dispatchEvent(new CustomEvent('graph:showplaceholders', {detail: {type, x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY}}))
    }

    handleClear(){
        if(!this.props.isClean){
            this.props.clear();
        }
    }

    handleHelp(){
        this.setState(previousState => ({...previousState, showHelp: true}))
    }

    handleHistory(action){
        switch (action) {
            case 'undo':
                this.props.undo();
                break;
            case 'redo':
                this.props.redo();
                break;
            default:
                this.props.undo();
        }
    }

    toggleTaskDialog(){
        ReactDOM.findDOMNode(this.__taskDialog).classList.toggle(styles['toggled']);
    }

    fullScreenHandler(){
        if(this.state.fullScreen){
            //this.handleExit();
            if(document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    render() {
        if( this.state.windowWidth < 720 )
            return (
                <div styleName = 'minHeight' >
                    <div>
                        <img src={ image } />
                    </div>
                        <h1>
                        <FormattedMessage id = 'gameditor.error.display.minsize'
                                          description = 'Game editor error: minimum size of screen'
                                          defaultMessage = 'Sorry, this application is intended to be used in screens with a minimum width of 720px'
                        />
                    </h1>
                </div>
            );
        else
            return (
            <div styleName = 'mainContainer'
                 ref =  { element => this.__full = element }>
                <Toolbar styleName='toolbar'
                         zoomHandler = { this.handleZoom }
                         createTaskHandler = { this.handleTaskCreation }
                         printHandler = { this.handlePrint }
                         saveHandler = { this.handleSave }
                         fullScreenHandler = {this.fullScreenHandler}
                         clearHandler = { this.handleClear }
                         helpHandler = { this.handleHelp }
                         historyHandler = {this.handleHistory}
                         canUndo = { this.props.canUndo }
                         canRedo = { this.props.canRedo }
                         isLoading = {this.props.isLoading }
                />

                <Editor styleName = 'editor'
                        graph = { this.props.graph }
                        selectedTask = { this.props.selectedTask }
                        scale = { this.state.scale }
                        addTask = { this.props.addTask }
                        selectTask = { this.props.selectTask }
                        moveTask = { this.props.moveTask }
                        isLoading = {this.props.isLoading}
                />

                <TaskDialog styleName = 'taskDialog'
                            ref =  { element => this.__taskDialog = element }
                            toggleTaskDialog = { this.toggleTaskDialog }
                            language = { this.props.language }
                            selectedTask = { this.props.selectedTask }
                            deleteTask = { this.props.deleteTask }
                            saveTask = { this.props.saveTask }
                            saveEdge = { this.props.saveEdge }
                            HMBData = { this.props.HMBData }
                />
            </div>
        )
    }
}

export default injectIntl(GameEditor)