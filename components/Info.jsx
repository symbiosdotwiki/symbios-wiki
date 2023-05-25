import React, { Component, useEffect, createRef } from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import SymbiosSVG from '../svg/symbios.svg'
import Socials from './Socials'

import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

class Info extends Component{
  animLength = 1
  firstTime = 0

  constructor(props){
    super(props)
    this.firstTime = this.props.getTime()
     this.animDelay = this.props.animDelay.bind(this)
  }

  render(){
    const { animDelay } = this
    const {
      infoClick, mainFile, getTime, animLength
    } = this.props
    const { data, content } = mainFile

    // console.log(content)

    return (
       <div 
        className="infoViewer"
        style={animDelay([animLength])}
      >
        
        <div
          className="info-stuff info-white"
          style={animDelay([animLength])}
        >
          <ReactMarkdown 
            parserOptions={{ commonmark: true }} 
            remarkPlugins={[remarkBreaks]}
          >
            {content}
          </ReactMarkdown>
            
        </div>

        <div 
          className="header"
        >
        <Socials
          animDelay={this.props.animDelay}
          getTime={getTime}
          animLength={animLength}
        />

         <SymbiosSVG 
          className="symbios-svg-header"
          style={animDelay([animLength])}
          onClick={infoClick}
        />
        </div>
      </div>
    )
  }
}

export default Info