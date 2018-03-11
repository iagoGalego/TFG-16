import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { autobind } from 'core-decorators'

import styles from './styles.scss'
import { buildGraph, bindGraphEvents } from '../../GraphEditor/Utils'

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
            scale: 1
        })
        bindGraphEvents(this.__graph, this.__newNodeContainer, this.props.selectedTask, this.props.addTask, this.props.selectTask)
    }

    componentDidUpdate() {
        this.__graph = buildGraph({
            graph: this.__graph,
            container: this.__graphContainer,
            graphDefinition: this.props.graph,
            selectedTask: this.props.selectedTask,
            scale: 1
        })
        bindGraphEvents(this.__graph, this.__newNodeContainer, this.props.selectedTask, this.props.addTask, this.props.selectTask)


    }

    render() {
        return (
            <div styleName = 'mainContainer' className = { this.props.className }>
                <div styleName = 'graph' ref = { element => this.__graphContainer = element } />
                <img ref = { element => this.__newNodeContainer = element } />
            </div>
        )
    }
}

export default Editor