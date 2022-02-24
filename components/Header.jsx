import React, { Component } from 'react'
import SymbiosSVG from '../svg/symbios.svg'
// import SymbiosSpin from '../svg/symbios-spin.svg'
import XPlus from './xPlus'

class Header extends Component {

  animLength = 1
  firstTime = 0

  constructor(props){
    super(props)
    this.firstTime = this.props.getTime()
     this.animDelay = this.props.animDelay.bind(this)
  }

  render(){
    const { animDelay } = this
    const {menuClick, animLength, expanded } = this.props
    return(
      <div 
        className="header"
        style={animDelay([animLength], 14)}
      >

      {/*<button onClick={menuClick}> FILTER </button>*/}

      <XPlus 
        onClick={menuClick}
        animDelay={animDelay}
        expanded={expanded}
      />
      
       <SymbiosSVG 
          className="symbios-svg-header"
          style={animDelay([animLength])}
        />
      </div>
    )
  }

}
export default Header 
