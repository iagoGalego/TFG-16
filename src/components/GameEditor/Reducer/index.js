import TYPES from '../Actions/types'
import undoable, { excludeAction } from 'redux-undo'
import UUID from "uuid";
import {
    AndJoinBuilder, AutomaticChoiceBuilder, OrJoinBuilder,
    UserChoiceBuilder
} from "../../../common/lib/model/builders";
import Translator from "../../../common/lib/model/translator";

const InitialState = {
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
    selectedWorkflow: null,
    selectedTask : null,
    isClean: true,
    isFetching: false,
    err : null,
    isLoading: true
};

function GameEditorReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    let newState, base, oldBase, id1 = UUID.v4(), id2 = UUID.v4();
console.log(type.toString())
    switch (type){
        case TYPES.SET_CLEAN:
            console.log(state)
            newState = {
                ...state,
                isClean: payload.clean,
                isLoading: payload.loader
            };
            newState = JSON.parse(JSON.stringify(newState));
            return newState;
        case TYPES.REQUEST:
            return {
                ...state,
                isFetching: true,
                isLoading: true
            };
        case TYPES.REQUEST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                err: null
            };
        case TYPES.REQUEST_FAILURE:
            return {
                ...state,
                isFetching: false,
                err: payload.err
            };
        case TYPES.SET_SELECTED_WORKFLOW:
            if(payload.workflow !== null) {
                let res = Translator.toEditorFormat({workflow:{elements: payload.workflow.element,sequenceFlow: payload.workflow.sequenceFlow}});

                newState = {
                    ...Object.assign({}, state),
                    graph: {
                        nodes:  res.nodes,
                        links: res.links
                    },
                    isClean: false,
                    isLoading: false,
                    selectedWorkflow: payload.workflow,
                };
                newState.graph = JSON.parse(JSON.stringify(newState.graph));
                return newState
            }
            alert("sali "+JSON.stringify(payload.workflow));
            newState = {
                ...Object.assign({}, state),
                selectedWorkflow: payload.workflow,
                graph : InitialState.graph,
                selectedTask : InitialState.selectedTask,
                isLoading: false,
                isClean: false
            };
            newState.graph = JSON.parse(JSON.stringify(newState.graph));
            return newState
        case TYPES.SELECTED_WORKFLOW_REQUEST_FAILURE:
            return {
                ...state,
                selectedWorkflow: payload.workflow,
                isFetching: false,
                err: payload.err
            };
        case TYPES.CLEAR_DIAGRAM:
            console.log(state)
            newState = {
                ...Object.assign({}, state),
                graph : Object.assign({}, InitialState.graph),
                selectedTask : Object.assign({}, InitialState.selectedTask)
            };

            newState.graph = JSON.parse(JSON.stringify(newState.graph));
            newState.selectedTask = JSON.parse(JSON.stringify(newState.selectedTask));

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
                        oldBase = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to);
                        const newCounter = oldBase.counter + 1;
                        base = {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter, fromLevel: oldBase.fromLevel, toLevel: oldBase.toLevel};
                        if(payload.link.isTransitable) base.isTransitable = true;
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
                                    base,
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 2, fromLevel: 1, toLevel: 1, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', counter: 2, fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: payload.link.from, to: id1, type: "verticalStart",  fromLevel: newCounter - 1, toLevel: 0 },
                                    {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: newCounter - 1, toLevel: 0 },
                                    {from: close.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: newCounter - 1 },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: newCounter - 1}
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    } else if(payload.link.isLoop){
                        const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter;
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes, payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                    {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1}
                                ],
                                links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 2,  fromLevel: 1, toLevel: 1, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', counter: 2, fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: payload.link.from, to: id1, type: "verticalStart",  fromLevel: newCounter - 1, toLevel: 0},
                                    {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: newCounter - 1, toLevel: 0},
                                    {from: close.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: newCounter -1},
                                    {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: newCounter -1 }
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
                                    {from: payload.link.from, to: payload.task.id, fromLevel: payload.link.fromLevel, toLevel: 0, type: payload.link.type === "parallelStart"? "parallelStart": ''},
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 2, fromLevel: 1, toLevel: 1, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', counter: 2, fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: close.task.id, to: payload.link.to, fromLevel: 0, toLevel: payload.link.toLevel, type: payload.link.type === "parallelEnd"? "parallelEnd": ''}
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    }
                } else {
                    if(payload.link.newEdge){
                        oldBase = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to);
                        const newCounter = oldBase.counter + 1;
                        base = {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter , fromLevel: oldBase.fromLevel, toLevel: oldBase.toLevel};
                        if(payload.link.isTransitable) base.isTransitable= true;
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
                                    base,
                                    {from: payload.task.id, to: close.task.id, isBase: true, counter: 0, fromLevel: 0, toLevel: 0},
                                    {from: payload.link.from, to: id1, type: "verticalStart", fromLevel: newCounter -1, toLevel: 0 },
                                    {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: newCounter -1, toLevel: 0 },
                                    {from: close.task.id, to: id2, type: "parallelEnd",  fromLevel: 0, toLevel: newCounter -1 },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: newCounter -1 }
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    } else if(payload.link.isLoop){
                        const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter;
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
                                    {from: payload.link.from, to: id1, type: "verticalStart", fromLevel: newCounter -1, toLevel: 0 },
                                    {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: newCounter -1, toLevel: 0 },
                                    {from: close.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: newCounter -1 },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: newCounter -1 }
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
                                    {from: payload.link.from, to: payload.task.id, fromLevel: payload.link.fromLevel, toLevel: 0, type: payload.link.type === "parallelStart"? "parallelStart": ''},
                                    {from: payload.task.id, to: close.task.id, isBase: true, counter: 0, fromLevel: 0, toLevel: 0},
                                    {from: close.task.id, to: payload.link.to, fromLevel: 0, toLevel: payload.link.toLevel, type: payload.link.type === "parallelEnd"? "parallelEnd": ''}
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    }
                }
            } else{
                if(payload.link.newEdge){
                    alert("lal")
                    oldBase = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to);
                    const newCounter = oldBase.counter + 1;
                    alert("newCounter2 "+newCounter)
                    base = {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter, fromLevel: oldBase.fromLevel, toLevel: oldBase.toLevel};
                    if(payload.link.isTransitable) base.isTransitable = true;
                    newState = {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [...state.graph.nodes,
                                payload.task,
                                {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1}
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                base,
                                {from: payload.link.from, to: id1, type: "verticalStart", fromLevel: newCounter - 1, toLevel: 0 },
                                {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: newCounter - 1, toLevel: 0 },
                                {from: payload.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: newCounter - 1 },
                                {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: newCounter - 1 }
                            ]
                        },
                        selectedTask: payload.task,
                    }
                } else if(payload.link.isLoop){
                    const newCounter = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to).counter;
                    alert("este new counter vale "+newCounter)
                    newState = {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [...state.graph.nodes,
                                payload.task,
                                {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y},
                                {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x,y: payload.task.y, start: id1}
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: id1, type: "verticalStart", fromLevel: newCounter -1, toLevel: 0 },
                                {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: newCounter -1, toLevel: 0 },
                                {from: payload.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: newCounter -1 },
                                {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: newCounter -1 }
                            ]
                        },
                        selectedTask: payload.task,
                    }
                } else {
                    alert(JSON.stringify(payload.task))
                    newState =  {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [
                                ...state.graph.nodes,
                                payload.task
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: payload.task.id, fromLevel: payload.link.fromLevel, toLevel: 0, type: payload.link.type === "parallelStart"? "parallelStart" : ''},
                                {from: payload.task.id, to: payload.link.to, fromLevel: 0, toLevel: payload.link.toLevel, type: payload.link.type === "parallelEnd"? "parallelEnd" : ''}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                }
            }
            newState.graph.nodes = JSON.parse(JSON.stringify(newState.graph.nodes));
            relocate(newState.graph, newState.graph.nodes.find(({id}) => (id === 'start')), newState.graph.nodes.find(({id}) => (id === 'end')), true);
            alert("estado anterior "+JSON.stringify(state))
            return newState;
        case TYPES.SET_SELECTED_TASK:
            console.log(state)
            newState = {
                ...Object.assign({}, state),
                selectedTask: (payload.task !== null && state.graph.nodes.find(({id}) => id === payload.task.id)) || null,
            };
            return newState
        case TYPES.DELETE_TASK:
            let st = Object.assign({}, state);
            let nodes, links, linkToNode, linkFromNode, linkFromEnd;

            if(payload.task.type === 'userChoice' || payload.task.type === 'automaticChoice' || payload.task.type === 'andSplit' || payload.task.type === 'loop'){
                //obtener el que llega al inicio y el que sale del final
                linkToNode = state.graph.links.find(({to, type}) => (to === payload.task.id && type !== 'return'));
                linkFromEnd  = state.graph.links.find(({from, to}) => (from === state.graph.nodes.find(({start}) => (start === payload.task.id)).id) && to !== payload.task.id);

                //TODO revisar
                setTimeout(recursiveDelete(st, payload.task, state.graph.nodes.find(({start}) => (start === payload.task.id)).id), 0);

                //quito linkFromEnd y el nodo final
                links = st.graph.links.filter(({from, to}) => (from !== linkFromEnd.from || to !== linkFromEnd.to));
                nodes = st.graph.nodes.filter(({start}) => (start !== payload.task.id));

                //quito enlaces que entran y salen del inicial y elimino el mismo nodo inicial
                nodes = nodes.filter(({id}) => id !== payload.task.id);
                links = links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id));

                //si estaba en una estructura
                if(nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' && nodes.find(({id}) => (id === linkFromEnd.to)).type === 'invisible' ){
                    let nodeEnd = state.graph.nodes.find(({id}) => (id === state.graph.links.find(({from}) => (from === linkFromEnd.to)).to))
                    if(nodeEnd.type === 'loopEnd'){
                        links.push({from: nodeEnd.start, to: nodeEnd.id, isLoop: true, reverse: true, counter: 2, fromLevel: 1, toLevel: 1})
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
                    let newLink = {from: linkToNode.from, to: linkFromEnd.to, fromLevel: linkToNode.fromLevel, toLevel: linkFromEnd.toLevel};
                    if(linkToNode.type === "parallelStart"){
                        newLink.type = "parallelStart"
                    } else if(linkFromEnd.type === "parallelEnd"){
                        newLink.type = "parallelEnd"
                    }
                    links.push(newLink)
                }

            } else if (payload.task.type === 'userChoiceEnd' || payload.task.type === 'automaticChoiceEnd' || payload.task.type === 'andSplitEnd' || payload.task.type === 'loopEnd'){
                linkToNode = state.graph.links.find(({to, type}) => (to === payload.task.start && type !== "return"))
                linkFromEnd  = state.graph.links.find(({from, to}) => (from === payload.task.id && to !== payload.task.start))

                recursiveDelete(st, state.graph.nodes.find(({id}) => (id === payload.task.start)), payload.task.id)

                links = st.graph.links.filter(({from, to}) => (from !== linkFromEnd.from || to !== linkFromEnd.to));
                nodes = st.graph.nodes.filter(({id}) => (id !== payload.task.id));

                nodes = nodes.filter(({id}) => id !== payload.task.start)
                links = links.filter(({from, to}) => (from !== payload.task.start && to !== payload.task.start));

                if(nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' &&
                    nodes.find(({id}) => (id === linkFromEnd.to)).type === 'invisible' ){
                    let x = state.graph.nodes.find(({id}) => (id === state.graph.links.find(({from}) => (from === linkFromEnd.to)).to));
                    if(x.type === 'loopEnd'){
                        links.push({from: x.start, to: x.id, isLoop: true, reverse: true, counter: 2, fromLevel: 1, toLevel: 1})
                    } else{
                        links.find(({from, to}) => (from === x.start && to === x.id)).counter--
                    }

                    links = links.filter(({to}) => (to !== nodes.find(({id}) => (id === linkToNode.from)).id));
                    links = links.filter(({from}) => (from !== nodes.find(({id}) => (id === linkFromEnd.to)).id));

                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkToNode.from)).id));
                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkFromEnd.to)).id));
                } else {
                    let newLink = {from: linkToNode.from, to: linkFromEnd.to, fromLevel: linkToNode.fromLevel, toLevel: linkFromEnd.toLevel};
                    if(linkToNode.type === "parallelStart"){
                        newLink.type = "parallelStart"
                    } else if(linkFromEnd.type === "parallelEnd"){
                        newLink.type = "parallelEnd"
                    }
                    links.push(newLink)
                }
            } else{
                linkToNode = state.graph.links.find(({to}) => (to === payload.task.id))
                linkFromNode = state.graph.links.find(({from}) => (from === payload.task.id))
                alert("seguro? "+JSON.stringify(linkToNode))
                nodes = state.graph.nodes.filter(({id}) => id !== payload.task.id)
                //quito verticalStart y verticalEnd
                links = state.graph.links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id))

                if( nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' &&
                    nodes.find(({id}) => (id === linkFromNode.to)).type === 'invisible' ){

                    let x = state.graph.nodes.find(({id}) => (id === state.graph.links.find(({from}) => (from === linkFromNode.to)).to))
                    if(x.type === 'loopEnd'){
                        links.push({from: x.start, to: x.id, isLoop: true, reverse: true, counter: 2, fromLevel: 1, toLevel: 1})
                    } else{
                        links.find(({from, to}) => (from === x.start && to === x.id)).counter--
                    }
                    //quito parallelStart y parallelEnd
                    links = links.filter(({to}) => (to !== nodes.find(({id}) => (id === linkToNode.from)).id))
                    links = links.filter(({from}) => (from !== nodes.find(({id}) => (id === linkFromNode.to)).id))
                    //quito invis
                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkToNode.from)).id))
                    nodes = nodes.filter(({id}) => (id !== nodes.find(({id}) => (id === linkFromNode.to)).id))
                } else {
                    let newLink = {from: linkToNode.from, to: linkFromNode.to, fromLevel: linkToNode.fromLevel, toLevel: linkFromNode.toLevel};
                    if(linkToNode.type === "parallelStart"){
                        newLink.type = "parallelStart"
                    } else if(linkFromNode.type === "parallelEnd"){
                        newLink.type = "parallelEnd"
                    }
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
            relocate(newState.graph, newState.graph.nodes.find(({id}) => (id === 'start')), newState.graph.nodes.find(({id}) => (id === 'end')), true);
            return newState;
        case TYPES.SAVE_TASK:
            newState = {
                ...state,
                graph: {
                    nodes: [...state.graph.nodes.filter(({id}) => id !== payload.task.id), payload.task],
                    links: state.graph.links
                },
            };
            newState = JSON.parse(JSON.stringify(newState));
            return newState;
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
            let newCounter = link.counter + 1;
            alert("newCounter "+newCounter);
            if(payload.task.isTransitable) {
                link.isTransitable = true;
                link.counter = newCounter;
                link.fromLevel = newCounter - 1;
                link.toLevel = newCounter - 1;
            }
            else {
                delete link.isTransitable;
                let lastLevel = link.fromLevel;
                link.counter--;
                link.fromLevel = 0;
                link.toLevel = 0;
                let invisiblesStart = state.graph.links.filter(({from, type}) => (from === payload.task.id && type === 'verticalStart'));
                invisiblesStart.map(
                    (i => {
                        if(i.fromLevel > lastLevel){
                            i.fromLevel = i.fromLevel - 1;
                            let invisibleParallel = state.graph.links.find(({from, type}) => (from === i.to && type === 'parallelStart'));
                            invisibleParallel.fromLevel = i.fromLevel;
                        }
                    })
                );
                let invisiblesEnd = state.graph.links.filter(({to, type}) => (to === link.to && type === 'verticalEnd'));
                invisiblesEnd.map(
                    (i => {
                        if(i.toLevel > lastLevel){
                            i.toLevel = i.toLevel - 1;
                            let invisibleParallel = state.graph.links.find(({to, type}) => (to === i.from && type === 'parallelEnd'));
                            invisibleParallel.toLevel = i.toLevel;
                        }
                    })
                )
            }
            destiny.isDisabled = payload.task.isDisabled;
            let newState = {
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
            newState.graph.links = JSON.parse(JSON.stringify(newState.graph.links));
            return newState;
        default:
            return JSON.parse(JSON.stringify(state));
    }
}

export default undoable(GameEditorReducer, {
    filter: excludeAction([
        TYPES.SET_SELECTED_TASK, TYPES.UNDO, TYPES.REDO, TYPES.MOVE_TASK,
        TYPES.SET_CLEAN, TYPES.REQUEST, TYPES.REQUEST_FAILURE, TYPES.REQUEST_SUCCESS,
        TYPES.SELECTED_WORKFLOW_REQUEST_FAILURE, TYPES.CLEAR_HISTORY
    ]),
    undoType: TYPES.UNDO,
    redoType: TYPES.REDO,
    clearHistoryType: TYPES.CLEAR_HISTORY,
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

function BFS(graph, start, end) {
    let datos=[];
    graph.nodes.map(
        (n) => {
            let u = {
                id: n.id,
                estado: false,
                distancia: -1,
                padre: null,
            };
            datos.push(u)
        });
    let s = datos.find(({id}) => id === start.id);

    s.estado = true;
    s.distancia = 0;
    s.padre = null;
    let q = [];
    q.unshift(datos.find(({id}) => id === start.id));
    while(q.length !== 0){
        let u = q.pop();
        let adyacentes = graph.links.filter(({from, type}) => from === u.id && type !== 'return');
        adyacentes.map(
            (adyacente) => {
                let newNode = datos.find(({id}) => id === adyacente.to);
                if(newNode.estado === false || (newNode.estado && u.distancia >= newNode.distancia))
                {
                    newNode.estado = true;
                    if(adyacente.type === 'parallelEnd' || adyacente.type === 'verticalStart'){
                        newNode.distancia = u.distancia ;
                    } else {
                        newNode.distancia = u.distancia + 1;
                    }
                    newNode.padre = u;
                    q.unshift(newNode);
                }
            }
        )
    }
    let node = datos.find(({id}) => id === end.id), len = 0, inParallel = false, marca = null;
    while(node.id !== start.id){
        let camino = graph.links.find(({from, to}) => from === node.padre.id && to === node.id);
        if(camino.to === marca) {
            inParallel = false;
        }
        else if(camino.type === 'verticalEnd' && inParallel === false) {
            marca = graph.nodes.find(({id}) => id === camino.from).start;
            inParallel = true;
        } else if((camino.type !== 'parallelStart' && camino.type !== 'verticalEnd') && inParallel) {
            len += 100;
        }
        node = datos.find(({id}) => id === node.padre.id);
    }
    if(end.type === 'invisible'){
        return {len: len, cont: datos.find(({id}) => id === end.id).distancia}
    } else {
        let cont = datos.find(({id}) => id === end.id).distancia;
        cont--;
        return {len: len, cont: cont}
    }
}

function relocate(graph, start, end, condition){
    let node = start, cont = 0, weight = 0;
    //sumatorio distancias entre complejos (inicio fin)
    let len = 0;
    //distance from start to end
    let totalDistance = end.x - start.x, initialDistance, distance, maxHeight;
    //saber pesos y numero de elementos
    if(condition){
        let x = BFS(graph, start, end);
        len = x.len;
        cont = x.cont;
        //saber cuanto ha de aumentar el final
        if(end.type === 'end'){
            if( cont * (1200/5) >= 1200 ){
                end.x = start.x + 240 * cont;
            } else{
                end.x = 1300;
            }
        } else{
            if( cont > 1 ){
                end.x = start.x + 200 * cont;
            } else{
                end.x = start.x + 300;
            }
        }
        totalDistance = end.x - start.x;
        initialDistance = start.x;
        distance = ( totalDistance - len ) / (cont+1);
    } else {
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
        if(weight > totalDistance * (5/1200) && (end.x + 200 * (weight - totalDistance * (5/1200))) >= 1300) {
            end.x = end.x + 200 * (weight - totalDistance * (5/1200))
        } else if(end.type === 'end')
            end.x = 1300;
        totalDistance = end.x - start.x;
        initialDistance = start.x;
        distance = ( totalDistance - len ) / cont;
    }


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
                    graph.nodes.find(({start}) => (start === invisibles[i].to)), true
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
                        graph.nodes.find(({start}) => (start === invisibles[i].to)), false
                    )
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
    //alert("fin "+initialDistance +" "+ distance)
    end.x = initialDistance + distance;
    return {x: end.x, y: maxHeight}
}
