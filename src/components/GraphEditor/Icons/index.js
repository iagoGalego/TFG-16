import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles.scss'
import FirstTaskIcon from './img/First.svg'
import LastTaskIcon from './img/Last.svg'
import AutomaticChoiceIcon from './img/AC.svg'
import UserChoiceIcon from './img/UC.svg'
import AndSplitIcon from './img/AS.svg'
import AutomaticTaskIcon from './img/AT.svg'
import UserTaskIcon from './img/UT.svg'

@CSSModules(styles) class HMBIcon extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        let {icon, onMouseDown, children} = this.props

        return  <figure styleName='icon' onMouseDown = { onMouseDown }>
                    <img src = { icon ? icon.type : children } />
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

        return  <figure styleName='icon-wide' onMouseDown = { onMouseDown }>
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

        return  <figure styleName='icon-wide' onMouseDown = { onMouseDown }>
            <img src = { UserTaskIcon } />
            <figcaption>{ tooltip }</figcaption>
        </figure>
    }
}

export {InitialTask, LastTask, AutomaticChoice, UserChoice, AndSplit, AutomaticTask, UserTask}
export default HMBIcon