/**
 * Created by victorjose.gallego on 9/14/16.
 */
import UUID from 'uuid'

import FirstTaskIcon from '../../GraphEditor/Icons/img/First.svg'
import LastTaskIcon from '../../GraphEditor/Icons/img/Last.svg'
import AutomaticChoiceIcon from '../../GraphEditor/Icons/img/AC.svg'
import UserChoiceIcon from '../../GraphEditor/Icons/img/UC.svg'
import AndSplitIcon from '../../GraphEditor/Icons/img/AS.svg'
import AutomaticTaskIcon from '../../GraphEditor/Icons/img/AT.svg'
import EndIcon from '../../GraphEditor/Icons/img/END.svg'
import UserTaskIcon from '../../GraphEditor/Icons/img/UT.svg'
import LoopIcon from '../../GraphEditor/Icons/img/LP.svg'

import { TASK_TYPE as T } from '../../../common/lib/model/builders'

import cytoscape from 'cytoscape'

function getImage(type){
    switch(type){
        case 'start':
        case T.INITIAL_TASK:
            return FirstTaskIcon
        case 'end':
        case T.LAST_TASK:
            return LastTaskIcon
        case 'userTask':
        case T.USER_TASK:
            return UserTaskIcon
        case 'userChoice':
        case T.USER_CHOICE:
            return UserChoiceIcon
        case 'andSplit':
        case T.AND_SPLIT:
            return AndSplitIcon
        case 'andSplitEnd':
        case T.AND_SPLIT_END:
            return EndIcon
        case 'automaticChoice':
        case T.AUTOMATIC_CHOICE:
            return AutomaticChoiceIcon
        case 'automaticChoiceEnd':
        case T.AUTOMATIC_CHOICE_END:
            return EndIcon
        case 'automaticTask':
        case T.AUTOMATIC_TASK:
            return AutomaticTaskIcon
        case 'userChoiceEnd':
        case T.USER_CHOICE_END:
            return EndIcon
        case 'loop':
        case T.LOOP:
            return LoopIcon
        case 'loopEnd':
        case T.LOOP_END:
            return EndIcon
        case 'invisible':
        default:
    }
}

export function symbolTypeToString(type){
    switch(type){
        case T.INITIAL_TASK:
            return 'start'
        case T.LAST_TASK:
            return 'end'
        case T.USER_TASK:
            return 'userTask'
        case T.USER_CHOICE:
            return 'userChoice'
        case T.AND_SPLIT:
            return 'andSplit'
        case T.AUTOMATIC_CHOICE:
            return 'automaticChoice'
        case T.AUTOMATIC_CHOICE_END:
            return 'automaticChoiceEnd'
        case T.AUTOMATIC_TASK:
            return 'automaticTask'
        case T.USER_CHOICE_END:
            return 'userChoiceEnd'
        case T.AND_SPLIT_END:
            return 'andSplitEnd'
        case T.LOOP:
            return 'loop'
        case T.LOOP_END:
            return 'loopEnd'
        default:
            return 'userTask'
    }
}
export function stringTypeToSymbol(type){
    switch(type){
        case 'start':
            return T.INITIAL_TASK
        case 'end':
            return T.LAST_TASK
        case 'userTask':
            return T.USER_TASK
        case 'userChoice':
            return T.USER_CHOICE
        case 'andSplit':
            return T.AND_SPLIT
        case 'automaticChoice':
            return T.AUTOMATIC_CHOICE
        case 'automaticChoiceEnd':
            return T.AUTOMATIC_CHOICE_END
        case 'automaticTask':
            return T.AUTOMATIC_TASK
        case 'userChoiceEnd':
            return T.USER_CHOICE_END
        case 'andSplitEnd':
            return T.AND_SPLIT_END
        case 'loop':
            return T.LOOP
        case 'loopEnd':
            return T.LOOP_END
        default:
            return T.USER_TASK
    }
}

function mapGraphToFormat({nodes, links}, selectedTask){
    let formatedGraph = {
        nodes: [],
        edges: []
    }

    nodes.map(({id, name, type, x, y}) => formatedGraph.nodes.push({
        selected: selectedTask !== null && selectedTask.id === id,
        data: {id, name, type, image: getImage(type)},
        position: { x, y }}))
    links.map(({from, to, isBase, type, level}) => formatedGraph.edges.push({selectable: false, data: {source: from, target: to, isBase: isBase, type: type, level: level}}))

    return formatedGraph
}

function getGraphStyles(){
    return cytoscape.stylesheet()
        .selector('node')
        .css({
            'height': '50px',
            'width': '50px',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-margin-y': '10px',
            'text-wrap': 'none',
            'font-size': '12px',
            'background-color': '#000',
        })
        .selector('node[type="start"], node[type="end"]')
        .css({
            'shape': 'ellipse',
        })
        .selector('node[type="andSplit"], node[type="automaticChoice"], node[type="userChoice"], node[type="userChoiceEnd"], node[type="automaticChoiceEnd"]')
        .css({
            'shape': 'diamond',
        })
        .selector('node[type="userTask"], node[type="automaticTask"]')
        .css({
            'height': '50px',
            'width': '75px',
            'shape': 'rectangle',
        })
        .selector('node[type="placeholder"]')
        .css({
            'background-color' : '#ccc',
            'opacity': '0.3',
            'height': '0',
            'width': '0',
            'shape': 'roundrectangle',
            'will-change': 'transform',
        })
        .selector('node[type="invisible"]')
        .css({
            'height': '2px',
            'width': '2px',
            'shape': 'rectangle',
            'visibility': 'hidden'
        })
        .selector('node[type="placeholder"].active')
        .css({
            'height': '50px',
            'width': '50px',
        })
        .selector('node[shape]')
        .css({
            'shape': 'data(shape)',
        })
        .selector('node[name]')
        .css({
            'content': 'data(name)',
        })
        .selector('node[image]')
        .css({
            'background-opacity': '1',
            'background-color': '#fff',
            'background-image': 'data(image)',
            'background-image-opacity': '1',
            'background-width': '100%',
            'background-height': '100%',
        })
        .selector('node:selected')
        .css({
            'shadow-color': '#000',
            'shadow-opacity': '0.7',
            'shadow-blur': '20px',
        })
        .selector('edge')
        .css({
            'width': 2,
            'line-color': '#000',
            'curve-style': 'bezier',
            'text-background-color': '#000',
            'text-background-opacity': '0.1',
            'text-background-shape': 'roundrectangle',
            'text-border-opacity': '0.3',
            'text-border-width': '1px',
            'text-border-style': 'dotted',
            'text-border-color': '#000',
            'text-outline-color': 'white',
            'text-outline-opacity': '1',
            'text-outline-width': '2px',
            'text-opacity': '0.7',
            'font-family': 'Material Icons',
            'font-size': '36px',
        })
        .selector('edge[type="arrow"]')
        .css({
            'target-arrow-shape': 'triangle',
            'width': 4,
            'line-color': '#000',
            'target-arrow-color': '#000',
            'curve-style': 'bezier',
        })
        .selector('edge.placeholder')
        .css({
            'content' : 'file_download',
        })
        .selector('edge[type="return"]')
        .selector('edge[type="parallel"]')
}

export function bindGraphEvents(graph, newNodeContainer, selectedTask, addTask, selectTask, scale, moveTask){
    //This is not working as expected. Review.

    function ADDTASKSTART(evt){
        try {
            graph.collection('edge').filter('[type!="return"]').addClass('placeholder')
        } catch (e){}

        newNodeContainer.src = getImage(evt.detail.type);
        newNodeContainer.style['position'] = 'fixed';
        newNodeContainer.style['display'] = 'block';
        newNodeContainer.style['z-index'] = 1000;
        newNodeContainer.style['opacity'] = 0.3;
        newNodeContainer.style['top'] = `${evt.detail.y - 20}px`;
        newNodeContainer.style['left'] = `${evt.detail.x - 20}px`;
        newNodeContainer.style['pointer-events'] = 'none';

        const onmousemove = onmousemoveevt => {
            newNodeContainer.style['top'] = `${onmousemoveevt.clientY - 20}px`
            newNodeContainer.style['left'] = `${onmousemoveevt.clientX - 20}px`
        }
        const onmouseup = onmouseupevt => {
            document.removeEventListener('mousemove', onmousemove, true)
            document.removeEventListener('mouseup', onmouseup, true)

            newNodeContainer.style['display'] = 'none'

            document.dispatchEvent(new CustomEvent('graph:hideplaceholders', {
                detail: {
                    type: evt.detail.type,
                    x: onmouseupevt.clientX - graph.container().getBoundingClientRect().left,
                    y: onmouseupevt.clientY - graph.container().getBoundingClientRect().top
                }
            }))
        };

        document.addEventListener('mousemove', onmousemove, true)
        document.addEventListener('mouseup', onmouseup, true)
    }
    function ADDTASKEND(evt){
        //SetTimeout 0 to prevent locking the interface
        setTimeout( () => {
            const {type, x, y} = evt.detail
            const labelSize = 36*graph.zoom() //Font size * scale
            const labelMargin = 16

            try {
                graph.collection('edge').filter('[type!="return"]').removeClass('placeholder')
            } catch(e) {}

            //Prevent droping outside the editor
            if(x < 0 || y < 0) return

            const edges = graph.collection('edge').filter('[type!="return"]')

            for (let i = 0; i<edges.size(); i++) {
                if(edges[i].cy().renderer() === null) return

                let boundingBox = {}

                //Get bounding box for edge
                try{
                    boundingBox = edges[i].renderedBoundingBox({includeNodes: false})
                } catch(e) {}

                //Calculate center position for edge
                const {xx, yy} = {
                    xx: boundingBox.x1 + ((boundingBox.x2-boundingBox.x1)/2),
                    yy: boundingBox.y1 + ((boundingBox.y2-boundingBox.y1)/2)
                }

                //Calculate label points
                const {xx1, xx2, yy1, yy2} = {
                    xx1: xx - labelSize/2 - labelMargin,
                    xx2: xx + labelSize/2 + labelMargin,
                    yy1: yy - labelSize/2 - labelMargin,
                    yy2: yy + labelSize/2 + labelMargin
                }

                //Check if drop in label position
                if( (xx1 < x) && (x < xx2) && (yy1 < y) && (y < yy2)){

                    const newTask = {
                        task: {
                            id: UUID.v4(),
                            type: symbolTypeToString(type),
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
                            x: (edges[i].source().position().x+edges[i].target().position().x)/2,
                            y: (edges[i].source().position().y+edges[i].target().position().y)/2
                        },
                        link: {
                            from: edges[i].source().id(),
                            to: edges[i].target().id()
                        }
                    }

                    if(edges[i].data().isBase) newTask.link.newEdge = true;

                    addTask(newTask)
                }
            }
        }, 0)
    }

    document.addEventListener('graph:showplaceholders', ADDTASKSTART);
    document.addEventListener('graph:hideplaceholders', ADDTASKEND);

    document.addEventListener('graph:zoomin', () => {graph.zoom( graph.zoom() + 0.1 )});
    document.addEventListener('graph:zoomout', () => {graph.zoom( graph.zoom() - 0.1 )});
    document.addEventListener('graph:reset', () => {graph.zoom( 0.8 )});


    graph.on('select', 'node', evt => {
        if(selectedTask === null ||  (selectedTask !== null && selectedTask.id !== evt.target.id()))
            selectTask({id: evt.target.id()})
    });

    graph.on('tap', evt => {
        if(evt.target.isNode === undefined || (evt.target.isNode !== undefined && !evt.target.isNode()))
            selectTask(null)
    });

    graph.on('mouseup', 'node',  evt => {
        moveTask(evt.target.json())
    })

}
export function buildGraph({graph, container, graphDefinition, selectedTask, scale}){

    if ( graphDefinition === undefined ){
        return
    }

    if (graph === null) {
        return cytoscape({
            container: container,
            boxSelectionEnabled: false,
            autoungrabify: false,
            zoom: scale,
            style: getGraphStyles(),
            elements: mapGraphToFormat(graphDefinition, selectedTask),
            layout: {
                name: 'concentric',
                fit: false,
                directed: false,
                padding: 50,
            }
        });
    }
    else {
        graph.elements().remove();
        graph.add( mapGraphToFormat(graphDefinition, selectedTask) );
        //graph.nodes().ungrabify()
        return graph
        //return graph.json( mapGraphToFormat(graphDefinition, selectedTask) );
    }
}