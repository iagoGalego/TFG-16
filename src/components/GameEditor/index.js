import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addTaskInLink, setSelectedTask, deleteTask, saveTask } from './Actions'

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
        language: state.UIState.language
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addTask: bindActionCreators(addTaskInLink, dispatch),
        selectTask: bindActionCreators(setSelectedTask, dispatch),
        deleteTask: bindActionCreators(deleteTask, dispatch),
        saveTask: bindActionCreators(saveTask, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameEditorWrapper)
