import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Actions from '../../components/GameEditor/Actions'

import GameEditor from '../../components/GameEditor'

class GameEditorWrapper extends Component {
    constructor() {
        super();
    }

    render() {
        return <GameEditor {...this.props} />
    }
}

function mapStateToProps(state) {
    return {
        graph : state.GameEditorState.graph,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        //toggleTaskDialog: bindActionCreators(toggleDialog, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameEditorWrapper);
