import React, { Component } from 'react'
import SymbiosSpin from '../svg/symbios-spin.svg'

const spinnerTime = 2

class SymbiosSpinner extends Component {

  render(){
    const { animDelay, animLength, loaded, size } = this.props
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
            style={blurStyle}
          /> 
        </span>
        <span className="center spin-loader spinny-refl">
          <SymbiosSpin
            className="spinny spinny-refl-svg"
            style={blurStyle}
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
