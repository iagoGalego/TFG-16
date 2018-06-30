import FirstTaskIcon from '../../Icons/img/First.svg'
import LastTaskIcon from '../../Icons/img/Last.svg'
import AutomaticChoiceIcon from '../../Icons/img/AC.svg'
import UserChoiceIcon from '../../Icons/img/UC.svg'
import AndSplitIcon from '../../Icons/img/AS.svg'
import AutomaticTaskIcon from '../../Icons/img/AT.svg'
import UserTaskIcon from '../../Icons/img/UT.svg'

import { TASK_TYPE as T } from '../../../../common/lib/model/builders'

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
        case 'automaticChoice':
        case T.AUTOMATIC_CHOICE:
            return AutomaticChoiceIcon
        case 'automaticTask':
        case T.AUTOMATIC_TASK:
            return AutomaticTaskIcon
        default:
            return UserTaskIcon
    }
}
function mapGraphToFormat(graph){
    let formatedGraph = {
        nodes: [],
        edges: []
    }

    graph.nodes.map(({id, name, type, x, y}) => formatedGraph.nodes.push({data: {id, name, type, image: getImage(type),  x, y}}))
    graph.links.map(({from, to}) => formatedGraph.edges.push({data: {source: from, target: to}}))

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
            'font-size': '8px'
        })
        .selector('node[type="start"], node[type="end"]')
        .css({
            'shape': 'ellipse',
        })
        .selector('node[type="andSplit"], node[type="automaticChoice"], node[type="userChoice"]')
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
            'border-width': '6px',
            'border-color': '#000'
        })
        .selector('edge')
        .css({
            'width': 4,
            'line-color': '#000',
            'target-arrow-color': '#000',
            'curve-style': 'bezier',
            'text-wrap' : 'wrap',
            'text-background-color': '#000',
            'text-background-opacity': '0.1',
            'text-background-shape': 'roundrectangle',
            'text-border-opacity': '0.3',
            'text-border-width': '1px',
            'text-border-style': 'dotted',
            'text-border-color': '#000',
            'font-family': 'Editor Placeholder Icon',
            'font-size': '3em',
            'text-outline-color': 'white',
            'text-outline-opacity': '1',
            'text-outline-width': '2px',
            'text-opacity': '1',
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
            'content' : 'i',
        })
}

export function bindGraphEvents(graph){
    try{
        function ADDTASKSTART(evt){
            try {
                graph.collection('edge').addClass('placeholder')
            } catch (e){}

            let img = document.createElement('img')
            img.id = 'newNode'
            img.src = getImage(evt.detail.type)
            img.style['position'] = 'fixed'
            img.style['z-index'] = 1000
            img.style['opacity'] = 0.75
            img.style['top'] = `${evt.detail.y - 20}px`
            img.style['left'] = `${evt.detail.x - 20}px`
            img.style['pointer-events'] = 'none'
            graph.container().appendChild(img)

            const onmousemove = evt => {
                img.style['top'] = `${evt.clientY}px`
                img.style['left'] = `${evt.clientX}px`
            }
            const onmouseup = () => {
                document.removeEventListener('mousemove', onmousemove, true)
                document.removeEventListener('mouseup', onmouseup, true)
                document.dispatchEvent(new CustomEvent('graph:hideplaceholders', {detail: {type: evt.detail.type}}))
            }

            document.addEventListener('mousemove', onmousemove, true)
            document.addEventListener('mouseup', onmouseup, true)
        }
        function ADDTASKEND(evt){
            document.getElementById('newNode').remove()
            try {
                graph.collection('edge').removeClass('placeholder')
            } catch (e){}
        }

        document.removeEventListener('graph:showplaceholders', ADDTASKSTART)
        document.removeEventListener('graph:hideplaceholders', ADDTASKEND)
        document.addEventListener('graph:showplaceholders', ADDTASKSTART)
        document.addEventListener('graph:hideplaceholders', ADDTASKEND)
    }catch(e){}
}
export function buildGraph({container, graph, scale}){
    return cytoscape({
        container: container,
        boxSelectionEnabled: false,
        autoungrabify: false,
        minZoom: 0.5,
        maxZoom: 10,
        zoom: scale,
        style: getGraphStyles(),
        elements: mapGraphToFormat(graph),
        layout: {
            name: 'breadthfirst',
            fit: true,
            directed: true,
            roots: '#start',
            padding: 50,
        }
    })
}