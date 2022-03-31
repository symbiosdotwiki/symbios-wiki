import React, { Component } from 'react'
import Plus from '../svg/plus.svg'


class XPlus extends Component {

  state = {
    loaded: false
  }

  animLength = 1
  firstTime = 0

  constructor(props){
    super(props)
    this.firstTime = this.props.getTime()
    this.animDelay = this.props.animDelay.bind(this)
    // console.log(this.firstTime)
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({loaded:true})
    // }, 500)
  }

  render(){
    const { onClick, expanded, animLength } = this.props
    const { animDelay } = this
    const { loaded } = this.state
    return(
      <div 
        className={"xPlus " + (expanded ? 'plus-rot' : '')}
        style={animDelay([animLength])}
        onClick={onClick}
      >
        
        <Plus 
          className={"plus-svg plus-refl "}
          style={animDelay([animLength])}
        />
        <Plus 
          className={"plus-svg plus-shad " }
          style={animDelay([animLength])}
        />
        <Plus 
          className="plus-svg"
          style={animDelay([animLength])}
        />
      </div>
    )
  }

}
export default XPlus 
