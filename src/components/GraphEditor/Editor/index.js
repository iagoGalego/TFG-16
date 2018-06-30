import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { autobind } from 'core-decorators'

import styles from './styles.scss'
import { buildGraph, bindGraphEvents } from '../../GraphEditor/Utils'
import ProgressBar from 'react-toolbox/lib/progress_bar';
import ReactDOM from 'react-dom';
import Translator from '../../../common/lib/model/translator'

@CSSModules(styles, {allowMultiple: true})
@autobind class Editor extends Component {
    constructor(props) {
        super(props);
        this.__graph = null
        this.state = {
            firstTime: true,
            fit: true,
        };
    }

    componentDidMount() {
        this.__graph = buildGraph({
            graph: this.__graph,
            container: this.__graphContainer,
            graphDefinition: this.props.graph,
            selectedTask: this.props.selectedTask,
            scale: this.props.scale
        });
    }

    componentDidUpdate(){
        this.__graph = buildGraph({
            graph: this.__graph,
            container: this.__graphContainer,
            graphDefinition: this.props.graph,
            selectedTask: this.props.selectedTask,
            scale: this.props.scale,
        });
    }

    componentWillUnmount(){
        document.dispatchEvent(new CustomEvent('graph:deleteEvents', {}))
        this.props.setZoom(0.8);
        this.setState(previousState => ({...previousState, firstTime: true, fit: false}));
    }

    componentWillReceiveProps(props){

        if(props.isLoading){
            ReactDOM.findDOMNode(this.__loaderContainer).style.display = 'block';
            ReactDOM.findDOMNode(this.__graphContainer).style.opacity = 0;
        } else{
            ReactDOM.findDOMNode(this.__loaderContainer).style.display = 'none';
            ReactDOM.findDOMNode(this.__graphContainer).style.opacity =  1;
            document.dispatchEvent(new CustomEvent('graph:deleteEvents', {}))
            bindGraphEvents(this.__graph, this.__newNodeContainer, props.selectedTask, this.props.addTask, this.props.selectTask, props.manageTask, this.props.setManageTask, this.props.setZoom, props.scale, this.state.fit)
            if(this.state.firstTime){
                this.setState(previousState => ({...previousState, firstTime: false, fit: true}));
            } else if(this.state.fit){
                this.setState(previousState => ({...previousState, firstTime: false, fit: false}));
            }
        }
    }

    render() {
        return(
            <div styleName = 'mainContainer' className = { this.props.className }>
                <ProgressBar styleName="loaderContainer" type='circular' mode='indeterminate'
                             ref = { element => this.__loaderContainer = element }
                />
                <div styleName = 'graph' ref = { element => this.__graphContainer = element } />
                <img ref = { element => this.__newNodeContainer = element } />
            </div>
        )
    }
}

export default Editor