import TYPES from '../Actions/types'
import undoable, { includeAction, excludeAction } from 'redux-undo'
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
                x: 400,
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
    zoom: 0.8,
    selectedWorkflow: null,
    selectedTask : null,
    isClean: true,
    isFetching: false,
    err : null,
    isLoading: true,
    roles: null,
    operators: null,
    properties: null,
    manageTask: false,
    manageTaskId: null,
    modified: false
};

function GameEditorReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    let newState, base, oldBase, id1 = UUID.v4(), id2 = UUID.v4();
    switch (type){
        case TYPES.TOGGLE_MANAGE_TASK:
            return {
                ...state,
                manageTask: !state.manageTask
            };
        case TYPES.SET_MODIFIED:
            return {
                ...state,
                modified: payload.modified
            };
        case TYPES.SET_ZOOM:
            return {
                ...state,
                zoom: payload.zoom
            };
        case TYPES.SET_MANAGE_TASK:
            if(payload.manageTaskId === null && state.manageTaskId === null){
                return {
                    ...state,
                    manageTaskId: undefined
                };
            } else{
                return {
                    ...state,
                    manageTaskId: payload.manageTaskId
                };
            }
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
                isLoading: false,
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
        case TYPES.SET_ROLES:
            newState = {
                ...Object.assign({}, state),
                roles: payload.roles,
            };
            newState.graph = JSON.parse(JSON.stringify(newState.graph));
            return newState;
        case TYPES.SET_ROLES_FAILURE:
            return {
                ...state,
                roles: payload.roles,
                isFetching: false,
                err: payload.err
            };
        case TYPES.SET_OPERATORS:
            newState = {
                ...Object.assign({}, state),
                operators: payload.operators,
                isClean: false,
                isLoading: true
            };
            newState.graph = JSON.parse(JSON.stringify(newState.graph));
            return newState;
        case TYPES.SET_OPERATORS_FAILURE:
            return {
                ...state,
                operators: payload.operators,
                isFetching: false,
                err: payload.err
            };
        case TYPES.SET_PROPERTIES:
            newState = {
                ...Object.assign({}, state),
                properties: payload.properties,
                isClean: false,
                isLoading: true
            };
            return newState;
        case TYPES.SET_PROPERTIES_FAILURE:
            return {
                ...state,
                properties: payload.properties,
                isFetching: false,
                err: payload.err
            };
        case TYPES.CLEAR_DIAGRAM:
            newState = {
                ...Object.assign({}, state),
                graph : Object.assign({}, InitialState.graph),
                selectedTask : Object.assign({}, InitialState.selectedTask)
            };

            newState.graph = JSON.parse(JSON.stringify(newState.graph));
            newState.selectedTask = JSON.parse(JSON.stringify(newState.selectedTask));
            newState.isClean = true;

            let start = newState.graph.nodes.find(({id}) => id === 'start');
            start.x = 100;
            start.y = 250;
            let end = newState.graph.nodes.find(({id}) => id === 'end');
            end.x = 400;
            end.y = 250;

            return newState;
        case TYPES.ADD_TASK_IN_LINK:
            if(payload.task.type === 'userChoice' || payload.task.type === 'automaticChoice' || payload.task.type === 'andSplit' || payload.task.type === 'loop'){
                payload.task.x -= 150;
                const close = createCloseNode(payload);

                if(payload.task.type === 'loop'){
                    payload.task.fromLevel = 0;
                    payload.task.conditions.push({condition: '', conditionValue: '', comparator: ''});
                    if(payload.link.newEdge){
                        oldBase = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to);
                        const newCounter = oldBase.counter + 1;
                        base = {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter, fromLevel: oldBase.fromLevel, toLevel: oldBase.toLevel};
                        if(payload.link.isTransitable) base.isTransitable = true;
                        let checkFrom = state.graph.nodes.find(({id}) => id === payload.link.from)
                        if(checkFrom.type === 'automaticChoice') checkFrom.conditions.push({condition: '', conditionValue: '', comparator: ''})
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes,
                                    payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y, fromLevel: newCounter - 1},
                                    {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1}
                                ],
                                links: [...state.graph.links.filter(({from, to}) => from !== payload.link.from || to !== payload.link.to),
                                    base,
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 2, fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', counter: 2, fromLevel: 1, toLevel: 1, reverse: true},
                                    {from: payload.link.from, to: id1, type: "verticalStart",  fromLevel: newCounter - 1, toLevel: 0 },
                                    {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: newCounter - 1, toLevel: 0 },
                                    {from: close.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: newCounter - 1 },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: newCounter - 1}
                                ]
                            },
                            selectedTask: payload.task,
                        }
                    } else if(payload.link.isLoop){
                        delete state.graph.nodes.find(({id}) => id === payload.link.from).fromLevel;
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes, payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y, fromLevel: 0},
                                    {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1}
                                ],
                                links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 2,  fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', counter: 2, fromLevel: 1, toLevel: 1, reverse: true},
                                    {from: payload.link.from, to: id1, type: "verticalStart",  fromLevel: 0, toLevel: 0},
                                    {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: 0, toLevel: 0},
                                    {from: close.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: 0},
                                    {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: 0 }
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
                                    {from: payload.task.id, to: close.task.id, isLoop: true, counter: 2, fromLevel: 0, toLevel: 0, reverse: true},
                                    {from: close.task.id, to: payload.task.id, type: 'return', counter: 2, fromLevel: 1, toLevel: 1, reverse: true},
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
                        let checkFrom = state.graph.nodes.find(({id}) => id === payload.link.from)
                        if(checkFrom.type === 'automaticChoice') checkFrom.conditions.push({condition: '', conditionValue: '', comparator: ''})
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes,
                                    payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y, fromLevel: newCounter -1},
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
                        delete state.graph.nodes.find(({id}) => id === payload.link.from).fromLevel
                        newState = {
                            ...Object.assign({}, state),
                            graph : {
                                nodes: [...state.graph.nodes,
                                    payload.task,
                                    close.task,
                                    {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y, fromLevel: 0},
                                    {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x, y: payload.task.y, start: id1,}
                                ],
                                links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                    {from: payload.task.id, to: close.task.id, isBase: true, counter: 0, fromLevel: 0, toLevel: 0},
                                    {from: payload.link.from, to: id1, type: "verticalStart", fromLevel: 0, toLevel: 0 },
                                    {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: 0, toLevel: 0 },
                                    {from: close.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: 0 },
                                    {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: 0 }
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
                    oldBase = state.graph.links.find(({from, to}) =>from === payload.link.from && to === payload.link.to);
                    const newCounter = oldBase.counter + 1;
                    base = {from: payload.link.from, to: payload.link.to, isBase: true, counter: newCounter, fromLevel: oldBase.fromLevel, toLevel: oldBase.toLevel};
                    if(payload.link.isTransitable) base.isTransitable = true;
                    let checkFrom = state.graph.nodes.find(({id}) => id === payload.link.from)
                    if(checkFrom.type === 'automaticChoice') checkFrom.conditions.push({condition: '', conditionValue: '', comparator: ''})
                    newState = {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [...state.graph.nodes,
                                payload.task,
                                {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y, fromLevel: newCounter - 1},
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
                    delete state.graph.nodes.find(({id}) => id === payload.link.from).fromLevel
                    newState = {
                        ...Object.assign({}, state),
                        graph : {
                            nodes: [...state.graph.nodes,
                                payload.task,
                                {id: id1, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.from).x, y: payload.task.y, fromLevel: 0},
                                {id: id2, type: 'invisible', x: state.graph.nodes.find(({id}) => id === payload.link.to).x,y: payload.task.y, start: id1}
                            ],
                            links: [...state.graph.links.filter(({from, to}) =>from !== payload.link.from || to !== payload.link.to),
                                {from: payload.link.from, to: id1, type: "verticalStart", fromLevel: 0, toLevel: 0 },
                                {from: id1, to: payload.task.id, type: "parallelStart", fromLevel: 0, toLevel: 0 },
                                {from: payload.task.id, to: id2, type: "parallelEnd", fromLevel: 0, toLevel: 0 },
                                {from: id2, to: payload.link.to, type: "verticalEnd", fromLevel: 0, toLevel: 0 }
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
                                {from: payload.link.from, to: payload.task.id, fromLevel: payload.link.fromLevel, toLevel: 0, type: payload.link.type === "parallelStart"? "parallelStart" : ''},
                                {from: payload.task.id, to: payload.link.to, fromLevel: 0, toLevel: payload.link.toLevel, type: payload.link.type === "parallelEnd"? "parallelEnd" : ''}
                            ]
                        },
                        selectedTask: payload.task,
                    }
                }
            }
            newState.graph.nodes = JSON.parse(JSON.stringify(newState.graph.nodes));
            newState.isClean = payload.clean;
            relocate(newState.graph, newState.graph.nodes.find(({id}) => (id === 'start')), newState.graph.nodes.find(({id}) => (id === 'end')), true);
            return newState;
        case TYPES.SET_SELECTED_TASK:
            let newSelectedTask = null;
            if(payload.task !== null)
                newSelectedTask = state.graph.nodes.find(({id}) => id === payload.task.id);
            newState = {
                ...Object.assign({}, state),
                selectedTask: (newSelectedTask && newSelectedTask.type !== 'invisible' && state.graph.nodes.find(({id}) => id === payload.task.id)) || null,
            };
            return newState;
        case TYPES.DELETE_TASK:
            let st = JSON.parse(JSON.stringify(state));
            let nodes, links, linkToNode, linkFromNode, linkFromEnd;

            if(payload.task.type === 'userChoice' || payload.task.type === 'automaticChoice' || payload.task.type === 'andSplit' || payload.task.type === 'loop'){
                //obtener el que llega al inicio y el que sale del final
                linkToNode = st.graph.links.find(({to, type}) => (to === payload.task.id && type !== 'return'));
                linkFromEnd  = st.graph.links.find(({from, to}) => (from === st.graph.nodes.find(({start}) => (start === payload.task.id)).id) && to !== payload.task.id);

                //TODO revisar
                setTimeout(recursiveDelete(st, payload.task, st.graph.nodes.find(({start}) => (start === payload.task.id)).id), 0);

                //quito linkFromEnd y el nodo final
                links = st.graph.links.filter(({from, to}) => (from !== linkFromEnd.from || to !== linkFromEnd.to));
                nodes = st.graph.nodes.filter(({start}) => (start !== payload.task.id));

                //quito enlaces que entran y salen del inicial y elimino el mismo nodo inicial
                nodes = nodes.filter(({id}) => id !== payload.task.id);
                links = links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id));

                //si estaba en una estructura
                if(nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' && nodes.find(({id}) => (id === linkFromEnd.to)).type === 'invisible' ){
                    let nodeEnd = st.graph.nodes.find(({id}) => (id === st.graph.links.find(({from}) => (from === linkFromEnd.to)).to))
                    if(nodeEnd.type === 'loopEnd'){
                        nodes.find(({id}) => id === nodeEnd.start).fromLevel = 0;
                        links.push({from: nodeEnd.start, to: nodeEnd.id, isLoop: true, reverse: true, counter: 2, fromLevel: 1, toLevel: 1})
                    } else{
                        let deletedFromLevel = linkToNode.fromLevel;
                        let checkFrom = nodes.find(({id}) => id === nodeEnd.start)
                        if(checkFrom.type === 'automaticChoice') checkFrom.conditions.splice(deletedFromLevel, 1);

                        let startPaths = links.filter(({from}) => from === nodeEnd.start);
                        let endPaths = links.filter(({to}) => to === nodeEnd.id);
                        endPaths.map(
                            (path) => {
                                if(!path.isBase){
                                    if(path.toLevel > deletedFromLevel){
                                        path.toLevel--;
                                        let n = nodes.find(({id}) => id === path.from);
                                        n.toLevel--;
                                        let secondPath = links.find(({to}) => to === n.id);
                                        secondPath.toLevel--;
                                    }
                                }
                            }
                        );
                        startPaths.map(
                            (path) => {
                                if(path.isBase && path.isTransitable){
                                    if(path.fromLevel > deletedFromLevel){
                                        path.fromLevel--;
                                        path.toLevel--;
                                        nodes.find(({id}) => id === nodeEnd.start).fromLevel--;
                                    }
                                    path.counter--;
                                } else if(!path.isBase){
                                    if(path.fromLevel > deletedFromLevel){
                                        path.fromLevel--;
                                        let n = nodes.find(({id}) => id === path.to);
                                        n.fromLevel--;
                                        let secondPath = links.find(({from}) => from === n.id);
                                        secondPath.fromLevel--;
                                    }
                                }
                            }
                        );
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
                linkToNode = st.graph.links.find(({to, type}) => (to === payload.task.start && type !== "return"))
                linkFromEnd  = st.graph.links.find(({from, to}) => (from === payload.task.id && to !== payload.task.start))

                recursiveDelete(st, st.graph.nodes.find(({id}) => (id === payload.task.start)), payload.task.id)

                links = st.graph.links.filter(({from, to}) => (from !== linkFromEnd.from || to !== linkFromEnd.to));
                nodes = st.graph.nodes.filter(({id}) => (id !== payload.task.id));

                nodes = nodes.filter(({id}) => id !== payload.task.start)
                links = links.filter(({from, to}) => (from !== payload.task.start && to !== payload.task.start));

                if(nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' &&
                    nodes.find(({id}) => (id === linkFromEnd.to)).type === 'invisible' ){
                    let x = st.graph.nodes.find(({id}) => (id === st.graph.links.find(({from}) => (from === linkFromEnd.to)).to));
                    if(x.type === 'loopEnd'){
                        nodes.find(({id}) => id === x.start).fromLevel = 0;
                        links.push({from: x.start, to: x.id, isLoop: true, reverse: true, counter: 2, fromLevel: 1, toLevel: 1})
                    } else{
                        let deletedFromLevel = linkToNode.fromLevel;
                        let checkFrom = nodes.find(({id}) => id === x.start)
                        if(checkFrom.type === 'automaticChoice') checkFrom.conditions.splice(deletedFromLevel, 1);

                        let startPaths = links.filter(({from}) => from === x.start);
                        let endPaths = links.filter(({to}) => to === x.id);
                        endPaths.map(
                            (path) => {
                                if(!path.isBase){
                                    if(path.toLevel > deletedFromLevel){
                                        path.toLevel--;
                                        let n = nodes.find(({id}) => id === path.from);
                                        n.toLevel--;
                                        let secondPath = links.find(({to}) => to === n.id);
                                        secondPath.toLevel--;
                                    }
                                }
                            }
                        );
                        startPaths.map(
                            (path) => {
                                if(path.isBase && path.isTransitable){
                                    if(path.fromLevel > deletedFromLevel){
                                        path.fromLevel--;
                                        path.toLevel--;
                                        nodes.find(({id}) => id === x.start).fromLevel--;
                                    }
                                    path.counter--;
                                } else if(!path.isBase){
                                    if(path.fromLevel > deletedFromLevel){
                                        path.fromLevel--;
                                        let n = nodes.find(({id}) => id === path.to);
                                        n.fromLevel--;
                                        let secondPath = links.find(({from}) => from === n.id);
                                        secondPath.fromLevel--;
                                    }
                                }
                            }
                        );
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
                linkToNode = st.graph.links.find(({to}) => (to === payload.task.id))
                linkFromNode = st.graph.links.find(({from}) => (from === payload.task.id))
                nodes = st.graph.nodes.filter(({id}) => id !== payload.task.id)
                //quito verticalStart y verticalEnd
                links = st.graph.links.filter(({from, to}) => (from !== payload.task.id && to !== payload.task.id))

                if( nodes.find(({id}) => (id === linkToNode.from)).type === 'invisible' &&
                    nodes.find(({id}) => (id === linkFromNode.to)).type === 'invisible' ){

                    let x = st.graph.nodes.find(({id}) => (id === st.graph.links.find(({from}) => (from === linkFromNode.to)).to))
                    if(x.type === 'loopEnd'){
                        nodes.find(({id}) => id === x.start).fromLevel = 0;
                        links.push({from: x.start, to: x.id, isLoop: true, reverse: true, counter: 2, fromLevel: 1, toLevel: 1})
                    } else{
                        let deletedFromLevel = linkToNode.fromLevel;
                        let checkFrom = nodes.find(({id}) => id === x.start)
                        if(checkFrom.type === 'automaticChoice') checkFrom.conditions.splice(deletedFromLevel, 1);

                        let startPaths = links.filter(({from}) => from === x.start);
                        let endPaths = links.filter(({to}) => to === x.id);
                        endPaths.map(
                            (path) => {
                                if(!path.isBase){
                                    if(path.toLevel > deletedFromLevel){
                                        path.toLevel--;
                                        let n = nodes.find(({id}) => id === path.from);
                                        n.toLevel--;
                                        let secondPath = links.find(({to}) => to === n.id);
                                        secondPath.toLevel--;
                                    }
                                }
                            }
                        );
                        startPaths.map(
                            (path) => {
                                if(path.isBase){
                                    if(path.isTransitable && path.fromLevel > deletedFromLevel){
                                        path.fromLevel--;
                                        path.toLevel--;
                                        nodes.find(({id}) => id === x.start).fromLevel--;
                                    }
                                    path.counter--;
                                } else if(!path.isBase && path.fromLevel > deletedFromLevel){
                                    path.fromLevel--;
                                    let n = nodes.find(({id}) => id === path.to);
                                    n.fromLevel--;
                                    let secondPath = links.find(({from}) => from === n.id);
                                    secondPath.fromLevel--;
                                }
                            }
                        );
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
            };
            relocate(newState.graph, newState.graph.nodes.find(({id}) => (id === 'start')), newState.graph.nodes.find(({id}) => (id === 'end')), true);
            return newState;
        case TYPES.SAVE_TASK:
            return {
                ...state,
                manageTaskId: null,
                graph: {
                    nodes: [...state.graph.nodes.filter(({id}) => id !== payload.task.id), payload.task],
                    links: state.graph.links
                },
            };
        case TYPES.SAVE_EDGE:
            let destiny = Object.assign({}, state.graph.nodes.find(({start}) => start === payload.task.id));
            let link = Object.assign({}, state.graph.links.find(({from, to}) => from === payload.task.id && to === destiny.id));
            let task = Object.assign({}, state.graph.nodes.find(({id}) => id === payload.task.id));
            let links2 = state.graph.links.filter(({from, to}) => from !== link.from || to !== link.to);
            let nodes2 = state.graph.nodes.filter(({id}) => id !== payload.task.id && id !== destiny.id);
            let newCounter = link.counter + 1;
            payload.task = JSON.parse(JSON.stringify(payload.task));
            if(payload.task.isTransitable && !task.isTransitable) {
                link.isTransitable = true;
                link.counter = newCounter;
                link.fromLevel = newCounter - 1;
                link.toLevel = newCounter - 1;
                payload.task.fromLevel = newCounter - 1;
                if(payload.task.type === 'automaticChoice')
                    payload.task.conditions.push({condition: '', conditionValue: '', comparator: ''});
            }
            else if(!payload.task.isTransitable && task.isTransitable) {
                delete link.isTransitable;
                let deletedFromLevel = link.fromLevel;
                if(payload.task.type === 'automaticChoice')
                    payload.task.conditions.splice(deletedFromLevel, 1);
                link.counter--;
                link.fromLevel = 0;
                delete payload.task.fromLevel;
                link.toLevel = 0;
                let startPaths = links2.filter(({from}) => from === link.from);
                let endPaths = links2.filter(({to}) => to === link.to);
                endPaths.map(
                    (path) => {
                        if(!path.isBase){
                            if(path.toLevel > deletedFromLevel){
                                path.toLevel--;
                                let n = nodes2.find(({id}) => id === path.from);
                                n.toLevel--;
                                let secondPath = links2.find(({to}) => to === n.id);
                                secondPath.toLevel--;
                            }
                        }
                    }
                );
                startPaths.map(
                    (path) => {
                        if(!path.isBase){
                            if(path.fromLevel > deletedFromLevel){
                                path.fromLevel--;
                                let n = nodes2.find(({id}) => id === path.to);
                                n.fromLevel--;
                                let secondPath = links2.find(({from}) => from === n.id);
                                secondPath.fromLevel--;
                            }
                        }
                    }
                );
            }
            destiny.isRequired = payload.task.isRequired;
            destiny.isDisabled = payload.task.isDisabled;
            let newState = {
                ...state,
                graph: {
                    nodes: [
                        ...nodes2,
                        payload.task,
                        destiny],
                    links: [
                        ...links2,
                        link
                    ]
                }
            };
            newState.graph.links = JSON.parse(JSON.stringify(newState.graph.links));
            newState.graph.nodes = JSON.parse(JSON.stringify(newState.graph.nodes));
            return newState;
        default:
            return state;
    }
}

export default undoable(GameEditorReducer, {
    filter: includeAction([
        TYPES.SET_SELECTED_WORKFLOW, TYPES.ADD_TASK_IN_LINK, TYPES.SAVE_TASK, TYPES.SAVE_EDGE,
        TYPES.CLEAR_DIAGRAM, TYPES.DELETE_TASK
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
            if( cont * (300) >= 300 ){
                end.x = start.x + 240 * cont;
            } else{
                end.x = 400;
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
        if(weight > totalDistance * (1/300) && (end.x + 200 * (weight - totalDistance * (1/300))) >= 400) {
            end.x = end.x + 200 * (weight - totalDistance * (1/300))
        } else if(end.type === 'end')
            end.x = 400;
        totalDistance = end.x - start.x;
        initialDistance = start.x;
        distance = ( totalDistance - len ) / cont;
    }


    if(distance < 150) distance = 150;
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

            invisibles.sort(compare);

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
    end.x = initialDistance + distance;
    return {x: end.x, y: maxHeight}
}

function compare(a,b) {
    if (a.fromLevel < b.fromLevel)
        return -1;
    if (a.fromLevel > b.fromLevel)
        return 1;
    return 0;
}