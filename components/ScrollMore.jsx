import React, { Component } from 'react'
import ScrollArrow from '../svg/arrowScroll.svg'
import { Container, Row, Col } from 'react-bootstrap'

class ScrollMore extends Component {

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
      <Col 
        xs={12}
        md={6}
        lg={4}
        xl={3}
        className="post-teaser scrolly"
        ref={this.imgRef} 
        style={animDelay([animLength])}
      >
        <div className="scroll-stuff">
           <ScrollArrow 
            className="scroll-svg"
            style={animDelay([animLength])}
          />
          <div className="scrollSpacer"/>
          <div className="scrollText">
          SCROLL
          </div>
        </div>
      </Col>
    )
  }

}
export default ScrollMore 
