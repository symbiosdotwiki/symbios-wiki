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
    const {menuClick, animLength, expanded, infoClick, getTime } = this.props
    return(
      <div 
        className="header"
        style={animDelay([animLength])}
      >

      {/*<button onClick={menuClick}> FILTER </button>*/}

      <XPlus 
        onClick={menuClick}
        animDelay={this.props.animDelay}
        expanded={expanded}
        getTime={getTime}
        animLength={animLength}
      />
      
       <SymbiosSVG 
          className="symbios-svg-header"
          style={animDelay([animLength])}
          onClick={infoClick}
        />
      </div>
    )
  }

}
export default Header 
