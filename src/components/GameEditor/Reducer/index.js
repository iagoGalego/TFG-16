import TYPES from '../Actions/types'
import undoable, { includeAction } from 'redux-undo'
import {symbolTypeToString} from "../../GraphEditor/Utils";
import UUID from "uuid";

const InitialState = {
    graph : {
        nodes: [
            {
                id: 'start',
                type: 'start',
                x: 100,
                y: 250
            }, {
                id: 'end',
                type: 'end',
                x: 1300,
                y: 250
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
        case TYPES.CLEAR_DIAGRAM:
            return{
                ...state,
                graph : InitialState.graph,
                selectedTask : InitialState.selectedTask
            };
        case TYPES.ADD_TASK_IN_LINK:
            if(payload.task.type === 'userChoice' || payload.task.type === 'automaticChoice' ||
                payload.task.type === 'andSplit' || payload.task.type === 'loop'){
                const id = UUID.v4();
                payload.task.x -= 100;
                const close = {
                    task: {
                        id,
                        type: payload.task.type + 'End',
                        name: '',
                        description: '',
                        operator: '',
                        parameters: {},
                        rolesAllowed: [],
                        badges: [],
                        initialDate: null,
                        endingDate: null,
                        giveBadges: false,
                        givePoints: false,
                        points: '',
                        start: payload.task.id,
                        x: payload.task.x + 200,
                        y: payload.task.y
                    },
                    link: {
                        from: payload.task.id,
                        to: payload.link.to
                    }
                };
                if(payload.link.newEdge){
                    return {
                        ...state,
                        graph : {
                            nodes: [...state.graph.nodes, payload.task, close.task],
                            links: [...state.graph.links,
                                {from: payload.link.from, to: payload.task.id},
                                {from: payload.task.id, to: close.task.id, isBase: true, counter: 0},
                                {from: close.task.id, to: payload.link.to}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                } else if(payload.task.type === 'loop'){
                    return {
                        ...state,
                        graph : {
                            nodes: [...state.graph.nodes, payload.task, close.task],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: payload.task.id},
                                {from: payload.task.id, to: close.task.id},
                                {to: payload.task.id, from: close.task.id, type: 'return'},
                                {from: close.task.id, to: payload.link.to}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                } else {
                    return {
                        ...state,
                        graph : {
                            nodes: [...state.graph.nodes, payload.task, close.task],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: payload.task.id},
                                {from: payload.task.id, to: close.task.id, isBase: true, counter: 0},
                                {from: close.task.id, to: payload.link.to}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                }
            } else{
                 if(payload.link.newEdge){
                    const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter + 1;
                    payload.task.y -= 100;
                    return {
                        ...state,
                        graph : {
                            nodes: [...state.graph.nodes, payload.task],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter },
                                {from: payload.link.from, to: payload.task.id},
                                {from: payload.task.id, to: payload.link.to}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                } else{
                     return {
                         ...state,
                         graph : {
                             nodes: [...state.graph.nodes, payload.task],
                             links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                 {from: payload.link.from, to: payload.task.id},
                                 {from: payload.task.id, to: payload.link.to}
                             ]
                         },
                         selectedTask: payload.task,
                     }
                 }
            }
        case TYPES.SET_SELECTED_TASK:
            return {
                ...state,
                selectedTask: (payload.task !== null && state.graph.nodes.find(({id}) => id === payload.task.id)) || null,
            }
        case TYPES.DELETE_TASK:
            let st = Object.assign({}, state);
            let nodes, links, linkToNode, linkFromNode;

            if(payload.task.type === 'userChoice' || payload.task.type === 'automaticChoice' || payload.task.type === 'andSplit' || payload.task.type === 'loop'){
                linkToNode = state.graph.links.find(({to}) => (to === payload.task.id))
                linkFromNode = state.graph.links.filter(({from}) => (from !== payload.task.id))
                let linkFromEnd  = state.graph.links.find(({from, to}) => (from === state.graph.nodes.find(({start}) => (start === payload.task.id)).id) && to !== payload.task.id)
                recursiveDelete(state.graph.nodes.find(({start}) => (start === payload.task.id)).id, payload.task, st)

                links = st.graph.links.filter(({from, to}) => (from !== linkFromEnd.from || to !== linkFromEnd.to));
                nodes = st.graph.nodes.filter(({start}) => (start !== payload.task.id));

                nodes = nodes.filter(({id}) => id !== payload.task.id)
                links = links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id))

                if((nodes.find(({id}) => (id === linkToNode.from)).type === 'userChoice' ||
                    nodes.find(({id}) => (id === linkToNode.from)).type ===  'automaticChoice' ||
                        nodes.find(({id}) => (id === linkToNode.from)).type ===  'andSplit' ||
                        nodes.find(({id}) => (id === linkToNode.from)).type ===  'loop') &&
                    (nodes.find(({id}) => (id === linkFromEnd.to)).type === 'userChoiceEnd' ||
                    nodes.find(({id}) => (id === linkFromEnd.to)).type === 'automaticChoiceEnd' ||
                        nodes.find(({id}) => (id === linkFromEnd.to)).type === 'andSplitEnd' ||
                        nodes.find(({id}) => (id === linkFromEnd.to)).type === 'loopEnd') ){
                    links.find(({from, to}) => (from === linkToNode.from && to === linkFromEnd.to)).counter--
                } else {
                    let newLink = {from: linkToNode.from, to: linkFromEnd.to};
                    links.push(newLink)
                }

            } else if (payload.task.type === 'userChoiceEnd' || payload.task.type === 'automaticChoiceEnd' || payload.task.type === 'andSplitEnd' || payload.task.type === 'loopEnd'){
                linkToNode = state.graph.links.find(({to}) => (to === payload.task.start))
                linkFromNode = state.graph.links.filter(({from}) => (from !== payload.task.start))
                let linkFromEnd  = state.graph.links.find(({from, to}) => (from === payload.task.id && to !== payload.task.start))

                recursiveDelete(payload.task.id, state.graph.nodes.find(({id}) => (id === payload.task.start)), st)
                links = st.graph.links.filter(({from, to}) => (from !== linkFromEnd.from || to !== linkFromEnd.to));
                nodes = st.graph.nodes.filter(({id}) => (id !== payload.task.id));

                nodes = nodes.filter(({id}) => id !== payload.task.start)
                links = links.filter(({from, to}) => (from !== payload.task.start && to !== payload.task.start))

                if((nodes.find(({id}) => (id === linkToNode.from)).type === 'userChoice' ||
                        nodes.find(({id}) => (id === linkToNode.from)).type ===  'automaticChoice' ||
                        nodes.find(({id}) => (id === linkToNode.from)).type ===  'andSplit' ||
                        nodes.find(({id}) => (id === linkToNode.from)).type ===  'loop') &&
                    (nodes.find(({id}) => (id === linkFromEnd.to)).type === 'userChoiceEnd' ||
                        nodes.find(({id}) => (id === linkFromEnd.to)).type === 'automaticChoiceEnd' ||
                        nodes.find(({id}) => (id === linkFromEnd.to)).type === 'andSplitEnd' ||
                        nodes.find(({id}) => (id === linkToNode.from)).type ===  'loopEnd') ){
                    links.find(({from, to}) => (from === linkToNode.from && to === linkFromEnd.to)).counter--
                } else {
                    let newLink = {from: linkToNode.from, to: linkFromEnd.to};
                    links.push(newLink)
                }
            } else{
                linkToNode = state.graph.links.find(({to}) => (to === payload.task.id))
                linkFromNode = state.graph.links.find(({from}) => (from === payload.task.id))
                nodes = state.graph.nodes.filter(({id}) => id !== payload.task.id)
                links = [...state.graph.links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id))]

                if((nodes.find(({id}) => (id === linkToNode.from)).type === 'userChoice' ||
                        nodes.find(({id}) => (id === linkToNode.from)).type ===  'automaticChoice' ||
                        nodes.find(({id}) => (id === linkToNode.from)).type ===  'andSplit') &&
                    (nodes.find(({id}) => (id === linkFromNode.to)).type === 'userChoiceEnd' ||
                        nodes.find(({id}) => (id === linkFromNode.to)).type === 'automaticChoiceEnd' ||
                        nodes.find(({id}) => (id === linkFromNode.to)).type === 'andSplitEnd') ){
                    state.graph.links.find(({from, to}) => (from === linkToNode.from && to === linkFromNode.to)).counter--
                } else {
                    let newLink = {from: linkToNode.from, to: linkFromNode.to};
                    links.push(newLink)
                }
            }

            return {
                ...state,
                graph: {
                    nodes,
                    links
                },
            };
        case TYPES.SAVE_TASK:
            return {
                ...state,
                graph: {
                    nodes: [...state.graph.nodes.filter(({id}) => id !== payload.task.id), payload.task],
                    links: state.graph.links
                },
            };
        case TYPES.MOVE_TASK:
            const moved = state.graph.nodes.find(({id}) => id === payload.task.data.id);
            moved.x = payload.task.position.x;
            moved.y = payload.task.position.y;
            return {
                ...state,
                graph: {
                    nodes: [...state.graph.nodes.filter(({id}) => id !== payload.task.data.id), moved],
                    links: state.graph.links
                }
            };
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
function recursiveDelete(id,task, state) {
    let linksFromNode = state.graph.links.filter(({from}) => (from === task.id));
    for(let i = 0; i < linksFromNode.length; i++){
        if(linksFromNode[i].to !== id){
            recursiveDelete(id, state.graph.nodes.find(({id}) => (id === linksFromNode[i].to)), state);
            state.graph.nodes = state.graph.nodes.filter(({id}) => (id !== linksFromNode[i].to));
            state.graph.links = state.graph.links.filter(({to}) => (to !== linksFromNode[i].to))
        } else {
            state.graph.links = state.graph.links.filter(({from, to}) => (from !== linksFromNode[i].from || to !== linksFromNode[i].to))
        }
    }
}