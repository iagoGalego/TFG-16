import { TaskBuilder } from './builders'
import joint from 'jointjs'

export function buildGraph({nodes, links}){
    let graph = new joint.dia.Graph();

    for (let {type, name, description} of nodes)
        new TaskBuilder(type).setName(name).setDescription(description).addToGraph(graph)

    return graph
}

export function initializePaper(container, graph){

    var graph = new joint.dia.Graph

    var paper = new joint.dia.Paper({
        el: container,
        width: 10000,
        height: 10000,
        model: graph,
        gridSize: 10,
        perpendicularLinks: true,
        snapLinks: true,
        linkPinning: false,
        embeddingMode: false,
        markAvailable: true,
        multiLinks: false,
        restrictTranslate: true,
        async: true,
        defaultLink: new joint.dia.Link({
            attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
        }),
        defaultRouter: {
            name: 'manhattan',
            startDirections: ['right'],
            endDirections: ['left']
        },
        defaultConnector : {
            name: 'rounded',
            'stroke-width' :  2
        },
        validateConnection: (sourceView, sourceMagnet, targetView, targetMagnet) => {
            if (sourceMagnet && sourceMagnet.getAttribute('type') === 'input') return false
            if (!targetMagnet) return false
            if (targetMagnet.getAttribute('type') !== 'input') return false

            return true
        },
        validateMagnet: (cellView, magnet) => {
            let links = graph.getConnectedLinks(cellView.model, { outbound: true })

            return links.filter( x => x.attributes.source.port === magnet.getAttribute('port') ).length === 0
                && magnet.getAttribute('magnet') !== 'passive'
        },
    });

    var rect = new joint.shapes.basic.Rect({
        position: { x: 50, y: 70 },
        size: { width: 100, height: 40 }
    });

    graph.addCell(rect);

    return paper
}