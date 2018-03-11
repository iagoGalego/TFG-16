/**
 * Graph component:
 *     + Props:
 *          - graph: the Workflow object
 *          - translator: function to translate the WF object to anything compatible with JointJS
 *          - paperOptions : the options object to be passed to the JointJS Paper element
 */

//TODO translate WF to Graph
//TODO define JointHTMLElement template
//TODO define JointHTMLElement styles
//TODO icon reset zoom
//TODO menos de 768px -> cambiar toolbar

import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { injectIntl, defineMessages } from 'react-intl'
import { Scrollbars } from 'react-custom-scrollbars'

import Translator from '../../common/lib/model/translator'
import { autobind } from 'core-decorators'

import { IconButton } from 'react-toolbox/lib/button'
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card'
import Tooltip from 'react-toolbox/lib/tooltip'

import FirstTaskIcon from './Icons/images/First.svg'
import LastTaskIcon from './Icons/images/Last.svg'
import AutomaticChoiceIcon from './Icons/images/AC.svg'
import UserChoiceIcon from './Icons/images/UC.svg'
import AndSplitIcon from './Icons/images/AS.svg'
import AutomaticTaskIcon from './Icons/images/AT.svg'
import UserTaskIcon from './Icons/images/UT.svg'
import HMBIcon from './Icons'

import joint from 'jointjs'
import { TaskBuilder, AndSplitBuilder, AutomaticChoiceBuilder, UserChoiceBuilder } from './builders'

import styles from './styles.scss'

const TooltipButton = Tooltip(IconButton)

// STRINGS DEFINITIONS
const dialog = defineMessages({
    title : {
        id : 'games.editor.graph.addTaskDialog.title',
        description : 'Graph editor - Add Task Dialog - Title',
        defaultMessage : 'Add new task'
    },
    save : {
        id : 'games.editor.graph.addTaskDialog.save',
        description : 'Graph editor - Add Task Dialog - Save changes action',
        defaultMessage : 'Save changes'
    },
    discard : {
        id : 'games.editor.graph.addTaskDialog.discard',
        description : 'Graph editor - Add Task Dialog - Discard changes action',
        defaultMessage : 'Discard changes'
    }
})

const taskDialog = defineMessages({
    maximizeTooltip : {
        id : 'games.editor.graph.tasksDialog.tooltips.maximize',
        description : 'Graph editor - Tasks Dialog - Tooltips - Maximize',
        defaultMessage : 'Maximize'
    },
    minimizeTooltip: {
        id : 'games.editor.graph.tasksDialog.tooltips.minimize',
        description : 'Graph editor - Tasks Dialog - Tooltips - Minimize',
        defaultMessage : 'Minimize'
    }
})

const CTX_ACTION_TYPE = {
    ADD_TASK : Symbol('ADD_TASK'),
    ADD_USER_CHOICE : Symbol('ADD_USER_CHOICE'),
    ADD_AND_SPLIT : Symbol('ADD_AND_SPLIT'),
    ADD_JOIN : Symbol('ADD_JOIN'),
    ADD_AUTOMATIC_CHOICE : Symbol('ADD_AUTOMATIC_CHOICE'),
    EDIT_TASK : Symbol('EDIT_TASK')
}

function buildGraph(workflow, graph){
    new TaskBuilder().setName('Inicio').setDescription('Descripcion del reto').addOutPort().addToGraph(graph)
    new TaskBuilder().setName('Aceptar reto').setDescription('Descripcion del reto').addInPort().addOutPort().addToGraph(graph)
    new TaskBuilder().setName('Cuestionario preferencias').setDescription('Descripcion del reto').addInPorts(3).addOutPort().addToGraph(graph)
    new TaskBuilder().setName('Escaneo codigos QR').setDescription('Descripcion del reto').addInPort().addOutPorts(2).addToGraph(graph)
    new TaskBuilder().setName('Cuestionario compras').setDescription('Descripcion del reto').addInPort().addOutPort().addToGraph(graph)
    new TaskBuilder().setName('Visionado de videos').setDescription('Descripcion del reto').addInPort().addOutPorts(2).addToGraph(graph)
    new TaskBuilder().setName('Fin').setDescription('Descripcion del reto').addInPort().addToGraph(graph)
}

@CSSModules(styles, {allowMultiple: true})
@autobind class Graph extends Component {
    constructor(props) {
        super(props);
        this.__graph = new joint.dia.Graph()
        this.__toolbarGraph = new joint.dia.Graph()
        this.__scale = 0
        this.__x = 0
        this.__y = 0
        this.__graphName = ''
        this.__graphDescription = ''
        this.__graphProvider = ''
        this.__graphDesigner = ''
        this.__relativeDates = true
    }

    componentDidMount() {
        this.__paper = new joint.dia.Paper({
            el: this.__graphContainer,
            width: 10000,
            height: 10000,
            model: this.__graph,
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

                //TODO don't allow multiple links in the same input port
                //let links = this.__graph.getConnectedLinks(targetView.model, { inbound: true })
                //return links.filter( x => x.attributes.target.port === targetMagnet.getAttribute('port') ).length === 0
            },
            validateMagnet: (cellView, magnet) => {
                let links = this.__graph.getConnectedLinks(cellView.model, { outbound: true })

                return links.filter( x => x.attributes.source.port === magnet.getAttribute('port') ).length === 0
                    && magnet.getAttribute('magnet') !== 'passive'
            },
            ...this.props.paperOptions
        })

        // Event selecting various elements in graph
        this.__paper.on('blank:pointerdown', ($evt) => {
            if($evt.which !== 1)
                return

            let selectBox = document.createElement('div')
            selectBox.style.position = 'fixed'
            selectBox.style.zIndex = '10000'
            selectBox.style.opacity = '0.3'
            selectBox.style.pointerEvents = 'none'
            selectBox.style.backgroundColor = '#B0BEC5'
            selectBox.style.borderColor = '#607D8B'
            selectBox.style.borderWidth = '1px'
            selectBox.style.borderStyle = 'solid'
            selectBox.style.top = `${$evt.clientY}px`
            selectBox.style.left = `${$evt.clientX}px`
            let prevOnMouseMove = document.onmousemove
            let prevOnMouseUp = document.onmouseup

            document.onmousemove = (e) => {
                let paperOffset = this.__paper.el.getBoundingClientRect()

                if(e.clientX > paperOffset.left)
                    selectBox.style.width = `${Math.abs(e.clientX - $evt.clientX)}px`
                if(e.clientY > paperOffset.top)
                    selectBox.style.height = `${Math.abs(e.clientY - $evt.clientY)}px`
                selectBox.style.top = `${Math.max(paperOffset.top, Math.min($evt.clientY, e.clientY))}px`
                selectBox.style.left = `${Math.max(paperOffset.left, Math.min($evt.clientX, e.clientX))}px`
            }

            document.onmouseup = (e) => {
                let p1 = this.__paper.clientToLocalPoint({x : $evt.clientX, y : $evt.clientY})
                let p2 = this.__paper.clientToLocalPoint({x : e.clientX, y : e.clientY})
                let origin = { x : Math.min(Math.max(0, p1.x), Math.max(0, p2.x)), y : Math.min(Math.max(0, p1.y), Math.max(0, p2.y)) }
                let destination = { x : Math.max( p1.x, p2.x), y : Math.max( p1.y, p2.y) }

                let cells = this.__graph.getCells()

                if(cells.length > 0)
                    cells = cells.filter(cell =>{
                        try{
                            let box = cell.isLink() ? cell.findView(this.__paper).getBBox() : cell.getBBox()

                            let xInSelection = ((box.x > origin.x) && (box.x < destination.x)) ||
                                (((box.x + box.width) > origin.x) && ((box.x + box.width) < destination.x)) ||
                                ((box.x < origin.x) && ((box.x + box.width) > destination.x))

                            let yInSelection = ((box.y > origin.y) && (box.y < destination.y)) ||
                                (((box.y + box.height) > origin.y) && ((box.y + box.height) < destination.y)) ||
                                ((box.y < origin.y) && ((box.y + box.height) > destination.y))

                            return xInSelection && yInSelection
                        } catch(e){}

                        return false
                    })
                selectBox.remove()

                if (cells.length > 0){
                    this.__selectBox = new joint.shapes.devs.Coupled({
                        attrs : {
                            text : {
                                text : ''
                            },
                            '.body': {
                                'fill': '#B0BEC5',
                                'fill-opacity': 0.2
                            },
                        },
                        position: { x: origin.x, y: origin.y },
                        size: { width: destination.x - origin.x, height: destination.y - origin.y },
                    }).addTo(this.__graph)

                    cells.forEach( cell => { this.__selectBox.embed(cell); cell.toFront()})

                    this.__selectBox.fitEmbeds({padding : 10})

                    this.__selectBox.rotate(0,0)
                }

                document.onmousemove = prevOnMouseMove
                document.onmouseup = prevOnMouseUp
            }

            this.__mainContainer.appendChild(selectBox)
        })

        this.__paper.on('cell:pointerdown cell:pointermove', (cell) => {
            this.__cell = null

            if( this.__selectBox != null  && cell.id !== this.__selectBox.findView(this.__paper).id){
                this.__selectBox.getEmbeddedCells().forEach(cell => this.__selectBox.unembed(cell))
                this.__selectBox.remove()
                this.__selectBox = null
            }
        })

        this.__paper.on('blank:pointerdown', () => {
            this.__cell = null

            if(this.__selectBox != null){
                this.__selectBox.getEmbeddedCells().forEach(cell => this.__selectBox.unembed(cell))
                this.__selectBox.remove()
                this.__selectBox = null
            }
        })

        buildGraph(null, this.__graph)

        joint.layout.DirectedGraph.layout(this.__graph, { setLinkVertices: true })

        this.__HTMLElementsContainer.style.transform ='scale(1)'
    }

    shouldComponentUpdate(){
        return true
    }

    // TEMP
    translateGraphToOpenetFormat(){
        let graph = {
            ...this.__graph.toJSON(),
            name : this.__graphName,
            description: this.__graphDescription,
            provider : this.__graphProvider,
            designer : this.__graphDesigner,
            startDate: this.__startDate,
            expiryDate: this.__expiryDate,
            startDateIsRelative : this.__relativeDates,
            expiryDateIsRelative: this.__relativeDates,
        }

        console.log(Translator.toOpenetFormat(graph))
    }

    //TOOLBAR ACTIONS
    handleZoomInClick(){
        if (this.__scale === 9) return
        this.__scale++
        this.__paper.scale( 1+(this.__scale/10), 1+(this.__scale/10))
    }
    handleZoomOutClick(){
        if (this.__scale === -9) return
        this.__scale--
        this.__paper.scale( 1+(this.__scale/10), 1+(this.__scale/10))
    }
    handleZoomResetClick(){
        this.__scale = 0
        this.__paper.scale(1, 1)
    }
    handleFitToContentClick(){
        let graphBBox = this.__graph.getBBox(this.__graph.getElements())
        let containerSize = this.__mainContainer.getBoundingClientRect()
        let scaleX = containerSize.width / graphBBox.width
        let scaleY = containerSize.height / graphBBox.height
        let scale = Math.min(scaleX, scaleY)
        this.__paper.scale(scale)

        scaleX < scaleY
            ? this.__graphScrollContainer.scrollLeft(graphBBox.x)
            : this.__graphScrollContainer.scrollTop(graphBBox.y)
    }
    handlePrintClick(){
        alert("Not implemented yet!")
    }
    handleClearClick(){
        this.__graph.clear()
    }
    handleTaskCreation(evt, taskType){
        let dragPaperContainer = document.createElement('div')
        dragPaperContainer.style.position = 'fixed'
        dragPaperContainer.style.zIndex = '1000'
        dragPaperContainer.style.opacity = '0.75'
        dragPaperContainer.style.pointerEvents = 'none'
        dragPaperContainer.style.top = `${evt.nativeEvent.clientY}px`
        dragPaperContainer.style.left = `${evt.nativeEvent.clientX}px`

        this.__mainContainer.appendChild(dragPaperContainer)

        let dragGraph = new joint.dia.Graph()

        new joint.dia.Paper({
            el: dragPaperContainer,
            model: dragGraph,
            interactive: false,
            width : 200,
            height : 100
        })

        new TaskBuilder().setName(taskType).setDescription('Descripcion del reto').addOutPort().setPosition(0, 0).addToGraph(dragGraph)

        const onmousemove = (e) => {
            dragPaperContainer.style.top = `${e.clientY}px`
            dragPaperContainer.style.left = `${e.clientX}px`
        }

        const onmouseup = (e) => {
            let boxPosition = this.__paper.el.getBoundingClientRect()

            if (e.clientX > boxPosition.left && e.clientY > boxPosition.top) {
                let {x, y} = this.__paper.clientToLocalPoint({ x: e.clientX, y: e.clientY })
                this.__graph.addCell(dragGraph.getFirstCell().clone().position(x, y))
            }

            dragGraph.clear()
            dragPaperContainer.remove()

            document.removeEventListener('mousemove', onmousemove, true)
            document.removeEventListener('mouseup', onmouseup, true)
        }

        document.addEventListener('mousemove', onmousemove, true)
        document.addEventListener('mouseup', onmouseup, true)
    }
    handleHelpClick(){
        alert('not implemented yet')
    }

    //TODO implement on tasks
    handleRemoveTaskClick(){
        let htmlElement = document.querySelector(`[data-model-id='${this.__cell.model.id}']`)
        if (htmlElement && htmlElement.parentNode)
            htmlElement.parentNode.removeChild(htmlElement)
        this.__graph.getConnectedLinks(this.__cell.model).forEach( link => link.remove())
        this.__cell.remove({disconnectLinks : false})
        this.__nodeContextualMenu.style.display = 'none'
    }

    // ADD TASK DIALOG ACTIONS
    handleDialogToggle(){
        this.props.addTaskDialog.toggleFunction()
    }
    saveNewTask(){
        this.props.addTaskDialog.saveTask(
            new TaskBuilder()
                .setName('Añadida')
                .setDescription('Añadida')
                .addInPort()
                .addOutPort()
                .setPosition(this.__x, this.__y)
                .addToGraph(this.__graph)
                .build()
        )

        this.__x = 0
        this.__y = 0

        this.handleDialogToggle()
    }

    // PARTIAL RENDERS
    renderToolbar(){
        return (
            <nav styleName='toolbar'>
                <nav>
                    <HMBIcon tooltip = 'First task' onMouseDown = { (evt) => this.handleTaskCreation(evt, 'First task') } >
                        <FirstTaskIcon/>
                    </HMBIcon>
                    <HMBIcon tooltip = 'Last task' onMouseDown = { (evt) => this.handleTaskCreation(evt, 'Last task') } >
                        <LastTaskIcon/>
                    </HMBIcon>
                    <HMBIcon tooltip = 'And split' onMouseDown = { (evt) => this.handleTaskCreation(evt, 'And split') } >
                        <AndSplitIcon/>
                    </HMBIcon>
                    <HMBIcon tooltip = 'Automatic choice' onMouseDown = { (evt) => this.handleTaskCreation(evt, 'Automatic choice') } >
                        <AutomaticChoiceIcon/>
                    </HMBIcon>
                    <HMBIcon tooltip = 'User choice' onMouseDown = { (evt) => this.handleTaskCreation(evt, 'User choice') } >
                        <UserChoiceIcon/>
                    </HMBIcon>
                    <HMBIcon tooltip = 'User task' onMouseDown = { (evt) => this.handleTaskCreation(evt, 'User task') } >
                        <UserTaskIcon/>
                    </HMBIcon>
                    <HMBIcon tooltip = 'Automatic task' onMouseDown = { (evt) => this.handleTaskCreation(evt, 'Automatic task') } >
                        <AutomaticTaskIcon/>
                    </HMBIcon>
                </nav>
                <nav>
                    <section>
                        <IconButton icon='zoom_in' onClick = { this.handleZoomInClick } />
                        <IconButton icon='zoom_out' onClick = { this.handleZoomOutClick } />
                        <IconButton onClick = { this.handleZoomResetClick }>1:1</IconButton>
                        <IconButton icon='zoom_out_map' onClick = { this.handleFitToContentClick } />
                    </section>
                    <section>
                        <IconButton icon='print' onClick = { this.handlePrintClick } />
                        <IconButton icon='delete' onClick = { this.handleClearClick } />
                    </section>
                    <section>
                        <IconButton icon='help' onClick = { this.handleHelpClick } />
                    </section>
                </nav>
            </nav>
        )
    }
    renderTaskDialog({minimized}){
        const {intl : {formatMessage}} = this.props

        return (
            <Card styleName='taskDialog'>
                <CardTitle styleName='dialogControls'>
                    <TooltipButton icon={ minimized ? 'vertical_align_top' : 'vertical_align_bottom'}
                                   tooltip={formatMessage(minimized ? taskDialog.maximizeTooltip : taskDialog.minimizeTooltip)}
                                   tooltipPosition='horizontal'/>
                </CardTitle>

                { minimized
                    ? null
                    :
                        <CardText>

                        </CardText>
                }
            </Card>
        )
    }

    /*renderTaskDialog(){
        const { addTaskDialog, intl : { formatMessage } } = this.props;

        return (
            <Dialog
                actions = { [
                    <FlatButton
                        label = { formatMessage(dialog.save) }
                        primary = { true }
                        onClick = { this.saveNewTask }
                        icon = { <SaveIcon /> }
                    />,
                    <FlatButton
                        label = { formatMessage(dialog.discard) }
                        secondary = { true }
                        onClick = { this.handleDialogToggle }
                        icon = { <DeleteIcon /> }
                    />
                ] }
                title = { formatMessage(dialog.title) }
                modal = { true }
                open = { addTaskDialog.isOpened }
            >
            </Dialog>
        )
    }
    renderAddTaskDialog(){}
    renderAddAutomaticChoiceDialog(){}
    renderAddAndSplitDialog(){}
    renderUserChoiceDialog(){}*/

    render() {
        return (
            <div ref = { element => this.__mainContainer = element } styleName = 'mainContainer' >
                { this.renderToolbar() }
                <Scrollbars ref = { element => this.__graphScrollContainer = element } styleName = 'graphScrollContainer'>
                    <div ref = { element => this.__graphContainer = element } >
                        <div ref = { element => this.__HTMLElementsContainer = element } ></div>
                    </div>
                </Scrollbars>
                {/* this.renderTaskDialog() */}
                { /*taskSelected*/true && this.renderTaskDialog({minimized: /*state.minimized*/true})}
            </div>
        )
    }
}

export default injectIntl(Graph)