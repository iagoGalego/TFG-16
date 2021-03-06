import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {addTaskInLink, setSelectedWorkflow, edit, setSelectedTask, deleteTask, saveTask, saveEdge, clearDiagram, undo, redo, save} from './Actions'

import GameEditor from './GameEditor'

class GameEditorWrapper extends Component {
    constructor() {
        super()
    }

    render() {
        return <GameEditor {...this.props} />
    }
}

function mapStateToProps(state) {
    return {
        graph : state.GameEditorState.present.graph,
        selectedTask: state.GameEditorState.present.selectedTask,
        selectedWorkflow: state.GameEditorState.present.selectedWorkflow,
        language: state.UIState.language,
        canUndo: state.GameEditorState.past.length,
        canRedo: state.GameEditorState.future.length,
        isClean: state.GameEditorState.present.isClean,
        isLoading: state.GameEditorState.present.isLoading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addTask: bindActionCreators(addTaskInLink, dispatch),
        selectTask: bindActionCreators(setSelectedTask, dispatch),
        setSelectedWorkflow: bindActionCreators(setSelectedWorkflow, dispatch),
        deleteTask: bindActionCreators(deleteTask, dispatch),
        saveTask: bindActionCreators(saveTask, dispatch),
        saveEdge: bindActionCreators(saveEdge, dispatch),
        clear: bindActionCreators(clearDiagram, dispatch),
        undo: bindActionCreators(undo, dispatch),
        redo: bindActionCreators(redo, dispatch),
        save: bindActionCreators(save, dispatch),
        edit: bindActionCreators(edit, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameEditorWrapper)
