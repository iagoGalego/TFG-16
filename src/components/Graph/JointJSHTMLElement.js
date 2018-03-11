/**
 * Created by victorjose.gallego on 4/21/16.
 */

import joint from 'jointjs'
import _ from 'lodash'
import $ from 'jquery'

joint.shapes.html = {}

joint.shapes.html.Element = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
    markup: `<g class = 'rotatable'><g class = 'scalable'><rect class = 'body'/></g><g class = 'inPorts'/><g class = 'outPorts'/></g>`,
    portMarkup: `<g class='port port<%= id %>'><circle class='port-body'/></g>`,

    defaults: joint.util.deepSupplement({
        type: 'html.Element',
        size: { width: 1, height: 1 },

        inPorts: [],
        outPorts: [],

        attrs: {
            '.': { magnet: true },
            '.body': {
                width: 150, height: 250,
                stroke: 'none'
            },
            '.port-body': {
                r: 10,
                magnet: true,
                stroke: 'none'
            },
            text: {
                'pointer-events': 'none'
            },
            '.label': { 'ref-x': .5, 'ref-y': 10, ref: '.body', 'text-anchor': 'middle', fill: '#000000' },
            '.inPorts .port-label': { x:-30, dy: 4, 'text-anchor': 'end', fill: '#000000' },
            '.outPorts .port-label':{ x: 15, dy: 4, fill: '#000000' }
        },

        template: ''
    }, joint.shapes.basic.Generic.prototype.defaults),

    getPortAttrs: function(portName, index, total, selector, type) {

        var attrs = {}

        var portClass = 'port' + index
        var portSelector = selector + '>.' + portClass
        var portBodySelector = portSelector + '>.port-body'

        attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } }
        attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) }

        if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0 }

        return attrs
    }
}))

joint.shapes.html.ElementView = joint.dia.ElementView.extend(_.extend(
    {},
    joint.shapes.basic.PortsViewInterface,
    {
        initialize: function() {
            _.bindAll(this, 'updateBox')
            joint.dia.ElementView.prototype.initialize.apply(this, arguments)

            this.$box = $(_.template(`<div class = 'html-element' data-model-id = ${this.model.get('id')} >${this.model.get('template')}</div>`)())
            this.model.on('change', this.updateBox, this)
            this.model.on('remove', () => {
                this.removeBox()
            })

            this.updateBox()
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments)

            this.paper.$el.children('div').prepend(this.$box)
            this.updateBox()

            return this
        },
        updateBox: function() {
            var bbox = this.model.getBBox()
            this.$box.find('.html-element').text(this.model.get('template'))
            this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' })
        },
        removeBox: function(evt) {
            this.$box.remove()
        }
    })
);

export default joint.shapes.html