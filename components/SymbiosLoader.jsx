import React, { Component } from 'react'
import SymbiosSVG from '../svg/symbios.svg'
import SymbiosSpin from '../svg/symbios-spin.svg'


class SymbiosLoader extends Component {

  state = {
    loaded: false
  }

  animLength = 1
  firstTime = 0

  constructor(props){
    super(props)
    this.firstTime = this.props.getTime()
    this.animDelay = this.props.animDelay.bind(this)
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({loaded:true})
    // }, 500)
  }

  render(){
    const { animDelay } = this
    const { loaded, animLength } = this.state
    return(
      <div 
        className="cover"
        style={animDelay([animLength], 14)}
      >
        
        <SymbiosSVG 
          className="symbios-svg hidden-refl"
          style={animDelay([animLength])}
        />
        <SymbiosSVG 
          className="symbios-svg hidden-shad"
          style={animDelay([animLength])}
        />
        <SymbiosSVG 
          className="symbios-svg"
          style={animDelay([animLength])}
        />
      </div>
    )
  }

}
export default SymbiosLoader 
