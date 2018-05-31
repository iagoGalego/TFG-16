import React, {Component} from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import CSSModules from 'react-css-modules'
import { autobind } from 'core-decorators'
import { Route } from "react-router-dom";

import Toolbar from '../GraphEditor/Toolbar'
import Editor from '../GraphEditor/Editor'
import TaskDialog from '../GraphEditor/TaskDialog'
import {bindActionCreators} from "redux";
import {Button} from 'react-toolbox/lib/button';
import {setTitle} from "../Layout/Actions";
import {connect} from "react-redux";
import styles from './styles.scss'
import image from './img/warning.svg'
import ReactDOM from "react-dom";
import {
    DateType, Metadata, ParameterValue, SequenceFlow, WorkflowTranslation,
    WorkflowTrigger
} from "../../common/lib/model";
import Translator from "../../common/lib/model/translator";
import HMBAPI from "../../common/lib/API";
import PropTypes from "prop-types";
import TYPES from './Actions/types'
import {addTaskInLink, edit, getOperators, getRoles, save, setSelectedWorkflow} from "./Actions";

const messages = defineMessages({
    title : {
        id : 'games.editor.title',
        description : 'Game Editor page title',
        defaultMessage : 'Game editor'
    }
});

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
@autobind class GameEditor extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            windowWidth: window.innerWidth,
            scale: 0.8,
            showHelp: false,
            fullScreen: false,
            loading: true,
            dontExist: false
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
    }

    componentWillReceiveProps(props) {
        if (props.roles !== null && props.operators !== null &&
            (props.roles !== this.props.roles || props.operators !== this.props.operators)) {
            if(props.isLoading){
                if(this.props.location.pathname.split( '/' )[3] === 'editor'){
                    this.props.setSelectedWorkflow(null);
                } else{
                    this.props.setSelectedWorkflow(this.props.location.pathname.split( '/' )[3]);
                }
            }
        } else if(props.selectedWorkflow !== null && props.selectedWorkflow !== this.props.selectedWorkflow &&
            Object.keys(props.selectedWorkflow).length === 0 && props.selectedWorkflow.constructor === Object){
            this.setState(previousState => ({...previousState, dontExist: true}));
        }
    }

    componentWillMount(){
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title))
    }

    componentDidMount() {
        this.props.getRoles();
        this.props.getOperators();

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
        if(ReactDOM.findDOMNode(this.__taskDialog).classList.contains(styles['toggledFullScreen'])){
            ReactDOM.findDOMNode(this.__taskDialog).classList.toggle(styles['toggled']);
            ReactDOM.findDOMNode(this.__taskDialog).classList.toggle(styles['toggledFullScreen']);
        } else if(ReactDOM.findDOMNode(this.__taskDialog).classList.contains(styles['toggled'])){
            ReactDOM.findDOMNode(this.__taskDialog).classList.toggle(styles['toggled']);
            ReactDOM.findDOMNode(this.__taskDialog).classList.toggle(styles['toggledFullScreen']);
        }
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
        alert(JSON.stringify(payload.metadata))
        let metadata = payload.metadata.map(
            (m) => {
                let md = new Metadata();
                md.name = "tag";
                md.metadataValue = m.metadataValue;
                return md;
            }
        );

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
            designer: this.props.loggedUser
        };

        let newGraph = { ...this.props.graph};
        newGraph.nodes.map(
            (node) => {
                if(!node.operator) node.operator = null;
                else {
                    node.operator = this.props.operators.find(({uri}) => uri === node.operator);
                    let param = new ParameterValue();
                    param.namedParameterValue = node.parameters;
                    param.genURI();
                    param.namedParameter = null;
                    node.parameterValue = [param]
                }
            }
        );

        if(newWorkFlow.uri === ''){
            this.props.save(Translator.toOpenetFormat({workflow: newWorkFlow, graph: newGraph})).then(
                (response) => {
                    if(response.type === TYPES.REQUEST_FAILURE)
                        alert("FAIL");
                    else if(response.type === TYPES.REQUEST_SUCCESS)
                        this.context.router.history.push("/app/games");

                }
            );
        } else {
            this.props.edit(Translator.toOpenetFormat({workflow: newWorkFlow, graph: newGraph})).then(
                (response) => {
                    if(response.type === TYPES.REQUEST_FAILURE)
                        alert("FAIL");
                    else if(response.type === TYPES.REQUEST_SUCCESS)
                        this.context.router.history.push("/app/games");

                }
            );
        }

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
        if(!this.state.fullScreen){
            ReactDOM.findDOMNode(this.__taskDialog).classList.toggle(styles['toggled']);
        } else {
            ReactDOM.findDOMNode(this.__taskDialog).classList.toggle(styles['toggledFullScreen']);
        }
    }

    fullScreenHandler(){
        if(this.state.fullScreen){
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
        else{
            if (this.state.dontExist){
                return  <div styleName="dontExist">
                    <div styleName="row">
                        <p>The searched game does not exist</p>
                        <div>
                            <Route
                                render={({ history}) => (
                                    <Button label='Search Games'
                                            raised
                                            primary
                                            onClick={ () => {
                                                history.push('/app/games')
                                            }}
                                    />
                                )}/>
                        </div>
                    </div>

                </div>
            } else{
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
                                 selectedWorkflow = {this.props.selectedWorkflow}
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
                        />
                    </div>
                )
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        roles: state.GameEditorState.present.roles,
        operators: state.GameEditorState.present.operators,
        loggedUser: state.AuthState.loggedUser,
        selectedWorkflow: state.GameEditorState.present.selectedWorkflow
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getRoles: bindActionCreators(getRoles, dispatch),
        getOperators: bindActionCreators(getOperators, dispatch),
        setAppTitle: bindActionCreators(setTitle, dispatch)
    }
}

export default injectIntl(GameEditor)