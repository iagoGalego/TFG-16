import TYPES from '../Actions/types'
import undoable, { excludeAction } from 'redux-undo'
import UUID from "uuid";
import {DateType, Metadata, SequenceFlow, WorkflowTrigger} from "../../../common/lib/model";
import Translator from "../../../common/lib/model/translator";

const InitialState = {
    workflow : {
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
        element: [],
        sequenceFlow: [],
        trigger: null,
        versionNumber: 0,
        isDesignFinished: false,
        isValidated: false,
        designer: ""
    },
    graph : {
        nodes: [
            {
                id: 'start',
                type: 'start',
                isInitial: true,
                isDisabled: false,
                isRequired: true,
                x: 100,
                y: 250
            }, {
                id: 'end',
                type: 'end',
                isFinal: true,
                isDisabled: false,
                isRequired: true,
                x: 1300,
                y: 250
            }
        ],
        links: [
            {
                from: 'start',
                fromLevel: 0,
                to: 'end',
                toLevel: 0,
            }
        ]
    },
    selectedTask : null,
    isClean: true
};

function GameEditorReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    let newState, id1 = UUID.v4(), id2 = UUID.v4();
    switch (type){
        case TYPES.SET_CLEAN:
            newState = {
                ...state,
                isClean: payload.clean
            };
            return newState;
        case TYPES.SAVE:
            let metadata = new Metadata();
            metadata.name = payload.workflow.metadata.name;
            metadata.metadataValue = payload.workflow.metadata.metadataValue;
            let designer = {
                name: payload.workflow.designer,
                email: payload.workflow.designer,
                completeName: payload.workflow.designer,
                passwordSHA: payload.workflow.designer,
                globalTagReference: [payload.workflow.designer],
                metadata: [],
            };

            newState = {
                ...state,
                workflow: {
                    ...state.workflow,
                    name: payload.workflow.name,
                    description: payload.workflow.description,
                    startDate: payload.workflow.startDate,
                    expiryDate: payload.workflow.expiryDate,
                    metadata: state.workflow.metadata,
                    modificationDate: payload.workflow.modificationDate,
                    provider: payload.workflow.provider,
                    designer: designer
                }
            };
            newState.workflow.metadata.push(metadata)
            alert(JSON.stringify(Translator.toOpenetFormat(newState)));
            return newState;
        case TYPES.CLEAR_DIAGRAM:
            newState = {
                ...state,
                graph : InitialState.graph,
                selectedTask : InitialState.selectedTask
            };

            let start = newState.graph.nodes.find(({id}) => id === 'start');
            start.x = 100;
            start.y = 250;
            let end = newState.graph.nodes.find(({id}) => id === 'end');
            end.x = 1300;
            end.y = 250;

            return newState;
        case TYPES.ADD_TASK_IN_LINK:
            if(payload.task.type === 'userChoice' || payload.task.type === 'automaticChoice' || payload.task.type === 'andSplit' || payload.task.type === 'loop'){
                payload.task.x -= 150;
                const close = createCloseNode(payload);

                if(payload.task.type === 'loop'){
                    if(payload.link.newEdge){
                        const newCounter = state.graph.links.find(({from, to}) => from === payload.link.from && to === payload.link.to).counter + 1;
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes,
                                    payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                    {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1}
                                ],
                                links: [...state.graph.links.filter(({from, to}) => from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter, fromLevel: 0, toLevel: 0 },
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 0, fromLevel: 1, toLevel: 1, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: payload.link.from, to: id1, type: "verticalStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                    {from: id1, to: payload.task.id, type: "parallelStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                    {from: close.task.id, to: id2, type: "parallelEnd", level: newCounter, fromLevel: 0, toLevel: newCounter },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", level: newCounter, fromLevel: 0, toLevel: newCounter }
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    } else if(payload.link.isLoop){
                        const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter + 1;
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes, payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                    {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1}
                                ],
                                links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 0, fromLevel: 1, toLevel: 1, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: payload.link.from, to: id1, type: "verticalStart", level: newCounter , fromLevel: newCounter, toLevel: 0},
                                    {from: id1, to: payload.task.id, type: "parallelStart", level: newCounter , fromLevel: newCounter, toLevel: 0},
                                    {from: close.task.id, to: id2, type: "parallelEnd", level: newCounter, fromLevel: 0, toLevel: newCounter },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", level: newCounter, fromLevel: 0, toLevel: newCounter }
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    } else {
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes,
                                    payload.task,
                                    close.task
                                ],
                                links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.link.from, to: payload.task.id, fromLevel: 0, toLevel: 0},
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 0, fromLevel: 1, toLevel: 1, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: close.task.id, to: payload.link.to, fromLevel: 0, toLevel: 0}
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    }
                } else {
                    if(payload.link.newEdge){
                        const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter + 1;
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes,
                                    payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                    {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y,start: id1}
                                ],
                                links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter , fromLevel: 0, toLevel: 0},
                                    {from: payload.task.id, to: close.task.id, isBase: true, counter: 0, fromLevel: 0, toLevel: 0},
                                    {from: payload.link.from, to: id1, type: "verticalStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                    {from: id1, to: payload.task.id, type: "parallelStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                    {from: close.task.id, to: id2, type: "parallelEnd", level: newCounter, fromLevel: 0, toLevel: newCounter },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", level: newCounter, fromLevel: 0, toLevel: newCounter }
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    } else if(payload.link.isLoop){
                        const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter + 1;
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes,
                                    payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                    {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1,}
                                ],
                                links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.task.id, to: close.task.id, isBase: true, counter: 0, fromLevel: 0, toLevel: 0},
                                    {from: payload.link.from, to: id1, type: "verticalStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                    {from: id1, to: payload.task.id, type: "parallelStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                    {from: close.task.id, to: id2, type: "parallelEnd", level: newCounter, fromLevel: 0, toLevel: newCounter },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", level: newCounter, fromLevel: 0, toLevel: newCounter }
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    } else{
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes,
                                    payload.task,
                                    close.task
                            ],
                                links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.link.from, to: payload.task.id, fromLevel: 0, toLevel: 0},
                                    {from: payload.task.id, to: close.task.id, isBase: true, counter: 0, fromLevel: 0, toLevel: 0},
                                    {from: close.task.id, to: payload.link.to, fromLevel: 0, toLevel: 0}
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    }
                }
            } else{
                if(payload.link.newEdge){
                    const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter + 1;
                    newState = {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [...state.graph.nodes,
                                payload.task,
                                {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1}
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter, fromLevel: 0, toLevel: 0 },
                                {from: payload.link.from, to: id1, type: "verticalStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                {from: id1, to: payload.task.id, type: "parallelStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                {from: payload.task.id, to: id2, type: "parallelEnd", level: newCounter, fromLevel: 0, toLevel: newCounter },
                                {from: id2, to: payload.link.to, type: "verticalEnd", level: newCounter, fromLevel: 0, toLevel: newCounter }
                            ]
                        },
                        selectedTask: payload.task,
                    }
                } else if(payload.link.isLoop){
                    const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter + 1;
                    newState = {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [...state.graph.nodes,
                                payload.task,
                                {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x,y: payload.task.y, start: id1}
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: id1, type: "verticalStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                {from: id1, to: payload.task.id, type: "parallelStart", level: newCounter, fromLevel: newCounter, toLevel: 0 },
                                {from: payload.task.id, to: id2, type: "parallelEnd", level: newCounter, fromLevel: 0, toLevel: newCounter },
                                {from: id2, to: payload.link.to, type: "verticalEnd", level: newCounter, fromLevel: 0, toLevel: newCounter }
                            ]
                        },
                        selectedTask: payload.task,
                    }
                }  else if(payload.link.type === "parallelStart"){
                    newState =  {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [
                                ...state.graph.nodes,
                                payload.task
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: payload.task.id, type: "parallelStart", fromLevel: 0, toLevel: 0},
                                {from: payload.task.id, to: payload.link.to, fromLevel: 0, toLevel: 0}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                } else if(payload.link.type === "parallelEnd"){
                    newState =  {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [
                                ...state.graph.nodes,
                                payload.task
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: payload.task.id, fromLevel: 0, toLevel: 0},
                                {from: payload.task.id, to: payload.link.to, type: "parallelEnd", fromLevel: 0, toLevel: 0}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                } else {
                    newState =  {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [
                                ...state.graph.nodes,
                                payload.task
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: payload.task.id, fromLevel: 0, toLevel: 0},
                                {from: payload.task.id, to: payload.link.to, fromLevel: 0, toLevel: 0}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                }
            }
            newState.graph.nodes = JSON.parse(JSON.stringify(newState.graph.nodes));
            relocate(newState.graph, newState.graph.nodes.find(({id}) => (id === 'start')), newState.graph.nodes.find(({id}) => (id === 'end')));
            return newState;
        case TYPES.SET_SELECTED_TASK:
            return {
                ...state,
                selectedTask: (payload.task !== null && state.graph.nodes.find(({id}) => id === payload.task.id)) || null,
            };
        case TYPES.DELETE_TASK:
            let st = Object.assign({}, state);
            let nodes, links, linkToNode, linkFromNode, linkFromEnd;

            if(payload.task.type === 'userChoice' || payload.task.type === 'automaticChoice' || payload.task.type === 'andSplit' || payload.task.type === 'loop'){
                //obtener el que llega al inicio y el que sale del final
                linkToNode = state.graph.links.find(({to, type}) => (to === payload.task.id && type !== 'return'))
                linkFromEnd  = state.graph.links.find(({from, to}) => (from === state.graph.nodes.find(({start}) => (start === payload.task.id)).id) && to !== payload.task.id)

                //TODO revisar
                setTimeout(recursiveDelete(st, payload.task, state.graph.nodes.find(({start}) => (start === payload.task.id)).id), 0);

                //quito linkFromEnd y el nodo final
                links = st.graph.links.filter(({from, to}) => (from !== linkFromEnd.from || to !== linkFromEnd.to));
                nodes = st.graph.nodes.filter(({start}) => (start !== payload.task.id));

                //quito enlaces que entran y salen del inicial y elimino el mismo nodo inicial
                nodes = nodes.filter(({id}) => id !== payload.task.id)
                links = links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id))

                //si estaba en una estructura
                if(nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' && nodes.find(({id}) => (id === linkFromEnd.to)).type === 'invisible' ){
                    let nodeEnd = nodes.find(({id}) => (id === links.find(({from}) => (from === nodes.find(({id}) => (id === nodes.find(({id}) => (id === linkFromEnd.to)).id)).id )).to))
                    if(nodeEnd.type === 'loopEnd'){
                        links.push({from: nodeEnd.start, to: nodeEnd.id, isLoop: true, counter: 0, fromLevel: 1, toLevel: 1})
                    } else{
                        links.find(({from, to}) => (from === nodeEnd.start && to === nodeEnd.id)).counter--
                    }

                    //quita el link que saldria de nodeStart a invisible
                    links = links.filter(({to}) => (to !== nodes.find(({id}) => (id === linkToNode.from)).id));
                    //quita el link que saldria de invisible a nodeEnd
                    links = links.filter(({from}) => (from !== nodes.find(({id}) => (id === linkFromEnd.to)).id));

                    //quita los invisibles
                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkToNode.from)).id));
                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkFromEnd.to)).id))
                } else {
                    //si no lo estaba pone enlace
                    let newLink = {from: linkToNode.from, to: linkFromEnd.to, fromLevel: 0, toLevel: 0};
                    links.push(newLink)
                }

            } else if (payload.task.type === 'userChoiceEnd' || payload.task.type === 'automaticChoiceEnd' || payload.task.type === 'andSplitEnd' || payload.task.type === 'loopEnd'){
                linkToNode = state.graph.links.find(({to, type}) => (to === payload.task.start && type !== "return"))
                linkFromNode = state.graph.links.filter(({from}) => (from !== payload.task.start))
                linkFromEnd  = state.graph.links.find(({from, to}) => (from === payload.task.id && to !== payload.task.start))

                recursiveDelete(st, state.graph.nodes.find(({id}) => (id === payload.task.start)), payload.task.id)

                links = st.graph.links.filter(({from, to}) => (from !== linkFromEnd.from || to !== linkFromEnd.to));
                nodes = st.graph.nodes.filter(({id}) => (id !== payload.task.id));

                nodes = nodes.filter(({id}) => id !== payload.task.start)
                links = links.filter(({from, to}) => (from !== payload.task.start && to !== payload.task.start));

                if(nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' &&
                    nodes.find(({id}) => (id === linkFromEnd.to)).type === 'invisible' ){
                    let x = nodes.find(({id}) => (id === links.find(({from}) => (from === nodes.find(({id}) => (id === nodes.find(({id}) => (id === linkFromEnd.to)).id)).id )).to))
                    if(x.type === 'loopEnd'){
                        links.push({from: x.start, to: x.id, isLoop: true, counter: 0, fromLevel: 1, toLevel: 1})
                    } else{
                        links.find(({from, to}) => (from === x.start && to === x.id)).counter--
                    }

                    links = links.filter(({to}) => (to !== nodes.find(({id}) => (id === linkToNode.from)).id));
                    links = links.filter(({from}) => (from !== nodes.find(({id}) => (id === linkFromEnd.to)).id));

                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkToNode.from)).id));
                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkFromEnd.to)).id));
                } else {
                    let newLink = {from: linkToNode.from, to: linkFromEnd.to, fromLevel: 0, toLevel: 0};
                    links.push(newLink)
                }
            } else{
                linkToNode = state.graph.links.find(({to}) => (to === payload.task.id))
                linkFromNode = state.graph.links.find(({from}) => (from === payload.task.id))
                nodes = state.graph.nodes.filter(({id}) => id !== payload.task.id)
                links = state.graph.links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id))

                if( nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' &&
                    nodes.find(({id}) => (id === linkFromNode.to)).type === 'invisible' ){

                    let x = nodes.find(({id}) => (id === links.find(({from}) => (from === nodes.find(({id}) => (id === nodes.find(({id}) => (id === linkFromNode.to)).id)).id )).to))
                    if(x.type === 'loopEnd'){
                        links.push({from: x.start, to: x.id, isLoop: true, counter: 0, fromLevel: 1, toLevel: 1})
                    } else{
                        links.find(({from, to}) => (from === x.start && to === x.id)).counter--
                    }
                    links = links.filter(({to}) => (to !== nodes.find(({id}) => (id === linkToNode.from)).id))
                    links = links.filter(({from}) => (from !== nodes.find(({id}) => (id === linkFromNode.to)).id))

                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkToNode.from)).id))
                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkFromNode.to)).id))
                } else {
                    let newLink = {from: linkToNode.from, to: linkFromNode.to, fromLevel: 0, toLevel: 0};
                    links.push(newLink)
                }
            }

            newState = {
                ...state,
                graph: {
                    nodes: JSON.parse(JSON.stringify(nodes)),
                    links
                }
            }
            relocate(newState.graph, newState.graph.nodes.find(({id}) => (id === 'start')), newState.graph.nodes.find(({id}) => (id === 'end')))
            return newState;
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
        case TYPES.SAVE_EDGE:
            let destiny = Object.assign({}, state.graph.nodes.find(({start}) => start === payload.task.id));
            let link = Object.assign({}, state.graph.links.find(({from, to}) => from === payload.task.id && to === destiny.id));
            if(payload.task.isTransitable) {
                link.isTransitable = true;
                link.counter++;
            }
            else {
                delete link.isTransitable;
                link.counter--;
            }
            destiny.isDisabled = payload.task.isDisabled;
            return {
                ...state,
                graph: {
                    nodes: [
                        ...state.graph.nodes.filter(({id}) => id !== payload.task.id && id !== destiny.id),
                        payload.task,
                        destiny],
                    links: [
                        ...state.graph.links.filter(({from, to}) => from !== link.from || to !== link.to),
                        link
                    ]
                }
            };
        default:
            return state
    }
}

export default undoable(GameEditorReducer, {
    filter: excludeAction([TYPES.SET_SELECTED_TASK, TYPES.MOVE_TASK, TYPES.SAVE, TYPES.SET_CLEAN]),
    undoType: TYPES.UNDO,
    redoType: TYPES.REDO,
    initTypes: ['@@redux-undo/GameEditor/INIT']
})

function createCloseNode(payload) {
    return {
        task: {
            id: UUID.v4(),
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
            x: payload.task.x + 300,
            y: payload.task.y
        },
        link: {
            from: payload.task.id,
            to: payload.link.to,
            fromLevel: 0,
            toLevel: 0
        }
    };
}

function recursiveDelete(state,task, endId) {
    let linksFromNode, actualNode, newNodes = [task];
    while (newNodes.length !== 0){
        actualNode = newNodes[0];
        newNodes = newNodes.filter(({id}) => (id !== actualNode.id));
        linksFromNode = state.graph.links.filter(({from}) => (from === actualNode.id));
        for(let i = 0; i < linksFromNode.length; i++){
            if(linksFromNode[i].to !== endId){
                newNodes.push(state.graph.nodes.find(({id}) => (id === linksFromNode[i].to)));
                state.graph.nodes = state.graph.nodes.filter(({id}) => (id !== linksFromNode[i].to));
                state.graph.links = state.graph.links.filter(({to}) => (to !== linksFromNode[i].to))
            } else {
                state.graph.links = state.graph.links.filter(({from, to}) => (from !== linksFromNode[i].from || to !== linksFromNode[i].to))
            }
        }
    }
}

function relocate(graph, start, end){
    let node = start, cont = 0, weight = 0;
    //sumatorio distancias entre complejos (inicio fin)
    let len = 0;
    //distance from start to end
    let totalDistance = end.x - start.x;

    //saber pesos y numero de elementos
    while(node.id !== end.id){
        //TODO Find interno devuelve mas de uno
        node = graph.nodes.find(({id}) => (id === graph.links.find(({from, type}) => (from === node.id && type !== 'return')).to));
        if(node.type ===  'userChoice' || node.type ===  'automaticChoice' ||
            node.type ===  'andSplit' || node.type ===  'loop'){
            len += graph.nodes.find(({start}) => (start === node.id)).x - node.x;
            node = graph.nodes.find(({start}) => (start === node.id));
            weight += 2;
        } else if(node.type === 'userTask' || node.type === 'automaticTask') weight ++;
        cont ++
    }

    //saber cuanto ha de aumentar el final
    if(weight > totalDistance * (5/1200) && (end.x + 200 * (weight - totalDistance * (5/1200))) >= 1300) {
        end.x = end.x + 200 * (weight - totalDistance * (5/1200))
    } else if(end.type === 'end') end.x = 1300;
    totalDistance = end.x - start.x;
    let initialDistance = start.x;
    let distance = ( totalDistance - len ) / cont, maxHeight;
    if(distance < 100) distance = 100;
    node = graph.nodes.find(({id}) => (id === graph.links.find(({from}) => (from === start.id)).to));

    maxHeight = start.y;
    let localMaxHeight = start.y;
    while(node.id !== end.id){
        let  dif = 0, res = 0;
        localMaxHeight =start.y;
        initialDistance += distance;
        node.x = initialDistance;
        node.y = start.y;
        if(node.type === 'userChoice' || node.type === 'automaticChoice' ||
            node.type === 'andSplit' || node.type === 'loop'){
            let invisibles = graph.links.filter(({from, type}) => (from === node.id && type === 'verticalStart'));

            for(let i = 0; i < invisibles.length; i++){
                graph.nodes.find(({id}) => (id === invisibles[i].to)).x = initialDistance;
                graph.nodes.find(({id}) => (id === invisibles[i].to)).y = localMaxHeight -85;

                res = relocate(graph,
                    graph.nodes.find(({id}) => (id === invisibles[i].to)),
                    graph.nodes.find(({start}) => (start === invisibles[i].to))
                );
                if(res.x > dif) dif = res.x;
                if(res.y < localMaxHeight) localMaxHeight = res.y;
                graph.nodes.find(({start}) => (start === invisibles[i].to)).y = graph.nodes.find(({id}) => (id === invisibles[i].to)).y
            }

            for(let i = 0; i < invisibles.length; i++){
                if(graph.nodes.find(({start}) => (start === invisibles[i].to)).x < dif){
                    //TODO revisar esta parte del if por rendimiento
                    graph.nodes.find(({id}) => (id === invisibles[i].to)).x = initialDistance;

                    graph.nodes.find(({start}) => (start === invisibles[i].to)).x = dif;
                    res = relocate(graph,
                        graph.nodes.find(({id}) => (id === invisibles[i].to)),
                        graph.nodes.find(({start}) => (start === invisibles[i].to))
                    );
                    //TODO esta sobra
                    graph.nodes.find(({start}) => (start === invisibles[i].to)).x = dif;
                }
                graph.nodes.find(({start}) => (start === invisibles[i].to)).y = graph.nodes.find(({id}) => (id === invisibles[i].to)).y
            }

            graph.nodes.find(({start}) => (start === node.id)).y = node.y;
            node = graph.nodes.find(({start}) => (start === node.id));
            if(dif !== 0){
                initialDistance = dif
            } else initialDistance += 300;
            node.x = initialDistance
        }
        if(localMaxHeight < maxHeight) maxHeight = localMaxHeight;
        node = graph.nodes.find(({id}) => (id === graph.links.find(({from, type}) => (from === node.id && type !== 'return')).to))
    }
    end.x = initialDistance + distance;
    return {x: end.x, y: maxHeight}
}
