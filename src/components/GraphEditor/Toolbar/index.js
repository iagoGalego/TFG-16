/**
 * Graph Editor Toolbar component
 *
 * Props:
 *  -taskCreationHandler
 *  -zoomHandler
 *  -printHandler
 *  -clearHandler
 *  -helpHandler
 *  
 * */

import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { injectIntl, defineMessages } from 'react-intl'
import { IconButton } from 'react-toolbox/lib/button'
import Tooltip from 'react-toolbox/lib/tooltip'

import { TASK_TYPE as T } from '../../../common/lib/model/builders'
import { AutomaticChoice, UserChoice, AndSplit, AutomaticTask, UserTask } from '../../GraphEditor/Icons'

import styles from './styles.scss'

const TooltipButton = Tooltip(IconButton)
const messages = defineMessages({
    zoomin : {
        id : 'games.editor.toolbar.tooltips.zoomin',
        description : 'Graph editor - Toolbar - Tooltips - Zoom in',
        defaultMessage : 'Zoom in'
    },
    zoomout: {
        id : 'games.editor.toolbar.tooltips.zoomout',
        description : 'Graph editor - Toolbar - Tooltips - Zoom out',
        defaultMessage : 'Zoom out'
    },
    zoomreset: {
        id : 'games.editor.toolbar.tooltips.zoomreset',
        description : 'Graph editor - Toolbar - Tooltips - Zoom reset',
        defaultMessage : 'Zoom reset'
    },
    zoomfit: {
        id : 'games.editor.toolbar.tooltips.zoomfit',
        description : 'Graph editor - Toolbar - Tooltips - Zoom fit to content',
        defaultMessage : 'Fit to content'
    },
    print: {
        id : 'games.editor.toolbar.tooltips.print',
        description : 'Graph editor - Toolbar - Tooltips - Print',
        defaultMessage : 'Print diagram'
    },
    clear: {
        id : 'games.editor.toolbar.tooltips.clear',
        description : 'Graph editor - Toolbar - Tooltips - Clear diagram',
        defaultMessage : 'Clear diagram'
    },
    help: {
        id : 'games.editor.toolbar.tooltips.help',
        description : 'Graph editor - Toolbar - Tooltips - Help',
        defaultMessage : 'Help'
    },
    save: {
        id : 'games.editor.toolbar.tooltips.save',
        description : 'Graph editor - Toolbar - Tooltips - Save',
        defaultMessage : 'Save'
    }
})

const Toolbar = ({
    className,
    createTaskHandler = () => alert('Not implemented yet!'),
    zoomHandler = () => alert('Not implemented yet!'),
    printHandler = () => alert('Not implemented yet!'),
    clearHandler = () => alert('Not implemented yet!'),
    helpHandler = () => alert('Not implemented yet!'),
    intl: { formatMessage }}) =>
    <nav className = { className } styleName='toolbar'>
        <nav>
            {/*<AndSplit onMouseDown = { (evt) => createTaskHandler(evt, T.AND_SPLIT) } />
            <AutomaticChoice onMouseDown = { (evt) => createTaskHandler(evt, T.AUTOMATIC_CHOICE) } />
            <UserChoice onMouseDown = { (evt) => createTaskHandler(evt, T.USER_CHOICE) } />*/null}
            <UserTask onMouseDown = { (evt) => createTaskHandler(evt, T.USER_TASK) }/>
            {/*<AutomaticTask onMouseDown = { (evt) => createTaskHandler(evt, T.AUTOMATIC_TASK) } />*/ null}
        </nav>
        <nav>
            <section>
                <TooltipButton icon = 'zoom_in'
                               tooltip = {formatMessage( messages.zoomin )}
                               onClick = { () => zoomHandler('in') } />
                <TooltipButton icon = 'zoom_out'
                               tooltip = {formatMessage( messages.zoomout )}
                               onClick = { () => zoomHandler('out') } />
                <TooltipButton icon = ''
                               tooltip = {formatMessage( messages.zoomreset )}
                               onClick = { () => zoomHandler('reset') }>1:1</TooltipButton>
                <TooltipButton icon = 'zoom_out_map'
                               tooltip = {formatMessage( messages.zoomfit )}
                               onClick = { () => zoomHandler('fit') } />
            </section>
            <section>
                <TooltipButton icon = 'save'
                               tooltip = {formatMessage( messages.save )}
                               onClick = { () => alert('estas de coña no?') } />
            </section>
            <section>
                <TooltipButton icon='print'
                               tooltip = {formatMessage( messages.print )}
                               onClick = { printHandler } />
                <TooltipButton icon='delete'
                               tooltip = {formatMessage( messages.clear )}
                               onClick = { clearHandler } />
            </section>
            <section>
                <TooltipButton icon='help'
                               tooltip = {formatMessage( messages.help )}
                               onClick = { helpHandler } />
            </section>
        </nav>
    </nav>

export default injectIntl(CSSModules(Toolbar, styles))