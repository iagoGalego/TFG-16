import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles.scss'
import FirstTaskIcon from './images/First.svg'
import LastTaskIcon from './images/Last.svg'
import AutomaticChoiceIcon from './images/AC.svg'
import UserChoiceIcon from './images/UC.svg'
import AndSplitIcon from './images/AS.svg'
import AutomaticTaskIcon from './images/AT.svg'
import UserTaskIcon from './images/UT.svg'

@CSSModules(styles) class HMBIcon extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        let {children, tooltip, onMouseDown} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
                    <img src = { children.type } />
                    <figcaption>{ tooltip }</figcaption>
                </figure>
    }
}
@CSSModules(styles) class InitialTask extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let {tooltip, onMouseDown} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
                    <img src = { FirstTaskIcon } />
                    <figcaption>{ tooltip }</figcaption>
                </figure>
    }
}
@CSSModules(styles) class LastTask extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let {tooltip, onMouseDown} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
            <img src = { LastTaskIcon } />
            <figcaption>{ tooltip }</figcaption>
        </figure>
    }
}
@CSSModules(styles) class AutomaticChoice extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let {tooltip, onMouseDown} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
            <img src = { AutomaticChoiceIcon } />
            <figcaption>{ tooltip }</figcaption>
        </figure>
    }
}
@CSSModules(styles) class UserChoice extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let {tooltip, onMouseDown} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
            <img src = { UserChoiceIcon } />
            <figcaption>{ tooltip }</figcaption>
        </figure>
    }
}
@CSSModules(styles) class AndSplit extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let {tooltip, onMouseDown} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
            <img src = { AndSplitIcon } />
            <figcaption>{ tooltip }</figcaption>
        </figure>
    }
}
@CSSModules(styles) class AutomaticTask extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let {tooltip, onMouseDown} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
            <img src = { AutomaticTaskIcon } />
            <figcaption>{ tooltip }</figcaption>
        </figure>
    }
}
@CSSModules(styles) class UserTask extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let {tooltip, onMouseDown} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
            <img src = { UserTaskIcon } />
            <figcaption>{ tooltip }</figcaption>
        </figure>
    }
}

export {InitialTask, LastTask, AutomaticChoice, UserChoice, AndSplit, AutomaticTask, UserTask}
export default HMBIcon