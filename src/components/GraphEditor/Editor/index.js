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
    }

    componentDidMount() {
        this.__graph = buildGraph({
            graph: this.__graph,
            container: this.__graphContainer,
            graphDefinition: this.props.graph,
            selectedTask: this.props.selectedTask,
            scale: this.props.scale
        });

        bindGraphEvents(this.__graph, this.__newNodeContainer, this.props.selectedTask, this.props.addTask, this.props.selectTask, this.props.scale, this.props.moveTask)
    }

    componentDidUpdate(){
        this.__graph = buildGraph({
            graph: this.__graph,
            container: this.__graphContainer,
            graphDefinition: this.props.graph,
            selectedTask: this.props.selectedTask,
            scale: this.props.scale
        });
    }

    componentWillReceiveProps(props){


        if(props.isLoading){
            ReactDOM.findDOMNode(this.__loaderContainer).style.display = 'block';
            ReactDOM.findDOMNode(this.__graphContainer).style.display = 'none';
        } else{
            ReactDOM.findDOMNode(this.__loaderContainer).style.display = 'none';
            ReactDOM.findDOMNode(this.__graphContainer).style.display = 'block';
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