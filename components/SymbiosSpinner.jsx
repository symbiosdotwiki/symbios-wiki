import React, { Component } from 'react'
import SymbiosSpin from '../svg/symbios-spin.svg'

const spinnerTime = 2

class SymbiosSpinner extends Component {

  constructor(props) {
    super(props)

    this.animDelay = this.props.animDelay.bind(this)
    this.firstTime = this.props.getTime()
  }

  render(){
    const { getTime, animLength, loaded, size } = this.props
    const { animDelay } = this
    const blurStyle = {
              ...animDelay([animLength, spinnerTime]),
              'filter': `blur(${size ? `${.01*size}vmin`  :'10px'})`
            }
    return(
      <span 
        className={"spinners-all " + (loaded ? 'hidden-spin' :'')}
      >
        <span className="center spin-loader spinny-shadow">
          <SymbiosSpin
            className="spinny spinny-shadow-svg"
            style={{
              ...blurStyle,
              ...animDelay([animLength, spinnerTime]),
            }}
          /> 
        </span>
        <span className="center spin-loader spinny-refl">
          <SymbiosSpin
            className="spinny spinny-refl-svg"
            style={{
              ...blurStyle,
              ...animDelay([animLength, spinnerTime]),
            }}
          /> 
        </span>

        <span className="center spin-loader">
          <SymbiosSpin
            className="spinny spinny-top-svg"
            style={animDelay([animLength, spinnerTime])}
          />
        </span>
      </span>
    )
  }

}
export default SymbiosSpinner 
