import TYPES from '../Actions/types'
import undoable, { includeAction } from 'redux-undo'

const InitialState = {
    graph : {
        nodes: [
            {
                id: 'start',
                type: 'start',
                x: 0,
                y: 0
            }, {
                id: 'end',
                type: 'end',
                x: 0,
                y: 1
            }
        ],
        links: [
            {
                from: 'start',
                to: 'end'
            }
        ]
    },
    selectedTask : null,
}

function GameEditorReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    switch (type){
        case TYPES.ADD_TASK_IN_LINK:
            return {
                ...state,
                graph : {
                    nodes: [...state.graph.nodes, payload.task],
                    links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from && to !== payload.link.to),
                            {from: payload.link.from, to: payload.task.id},
                            {from: payload.task.id, to: payload.link.to}
                    ]
                },
                selectedTask: payload.task,
            }
        case TYPES.SET_SELECTED_TASK:
            return {
                ...state,
                selectedTask: (payload.task !== null && state.graph.nodes.filter(({id}) => id === payload.task.id)[0]) || null,
            }
        case TYPES.DELETE_TASK:
            //TODO Caso basico de eliminar tareas en secuencia. Falta contemplar otros casos para evitar inconsistencias (p.e. bucles o condiciones).
            let linkToNode = state.graph.links.find(({to}) => (to === payload.task.id))
            let linkFromNode = state.graph.links.find(({from}) => (from === payload.task.id))
            let newLink = {from: linkToNode.from, to: linkFromNode.to}

            let nodes = state.graph.nodes.filter(({id}) => id !== payload.task.id)
            let links = [...state.graph.links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id)), newLink]

            return {
                ...state,
                graph: {
                    nodes,
                    links
                },
            }
        case TYPES.SAVE_TASK:
            return {
                ...state,
                graph: {
                    nodes: [...state.graph.nodes.filter(({id}) => id !== payload.task.id), payload.task],
                    links: state.graph.links
                },
            }
        default:
            return state
    }
}

export default undoable(GameEditorReducer, {
    filter: includeAction(TYPES.ADD_TASK_IN_LINK),
    undoType: TYPES.UNDO,
    redoType: TYPES.REDO,
    initTypes: ['@@redux-undo/GameEditor/INIT']
})

//Check undo/redo 