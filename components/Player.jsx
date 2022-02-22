import React, { Component } from 'react'

import ReactPlayer from 'react-player'
import BandcampPlayer from './BandcampPlayer'

import SymbiosSpinner from './SymbiosSpinner'

class IFrame extends Component {
	iframeRef = null

	constructor(props) {
		super(props)
		this.iframeRef = React.createRef()
	}

	componentDidUpdate() {
		console.log("iframe")
    this.iframeRef.current.addEventListener('onload', () => this.props.onReady())
  }

	render(){
		return (
			<iframe 
				ref={this.iframeRef}
				src={this.props.src}
				// {...this.props}
			/>
		)
	}
}


class Player extends Component {

	state = {
		loaded: false
	}

	spinnerTime = 2

	setLoaded = () => {
		console.log("DONE")
		this.setState({
			loaded: true
		})
	}

	constructor(props) {
    super(props)

    this.animDelay = this.props.animDelay.bind(this)
    this.firstTime = this.props.getTime()

  }

  render(){
  	const { playerType, onReady, ID } = this.props
  	const { animDelay, spinnerTime, setLoaded } = this
  	const { loaded } = this.state

  	let URL = 
  		playerType == 'youtube' ? 'https://www.youtube.com/watch?v=' + ID :
  		playerType == 'vimeo' ? 'https://www.vimeo.com/' + ID :
  		playerType == 'bandcamp' ? ID :
  		playerType == 'soundcloud' ? ID :
  		''


  	// console.log('URL')
  	// console.log(URL)
  	
  	return(
  		<span>
	  		<SymbiosSpinner 
	        animDelay={animDelay}
	        loaded={loaded}
	        spinnerTime={spinnerTime}
	        size={'50'}
	      />
	      <span className={"player-hidden " + (loaded ? "player-loaded" : '')}>{
		      playerType == 'iframe' ?
		        <iframe 
		        	src={ID}
		        	onLoad={setLoaded}
		        	//{...this.props}
		        /> :
		      playerType == 'bandcamp' ?
		        <BandcampPlayer 
		          album={ID.toString()} 
		          artwork="big"
		          width="40vmin"
		          height="55vmin"
		          bgcol="242626"
		          onLoad={setLoaded}
		          //{...this.props}
		        /> :
		      	<ReactPlayer 
		          url={URL} 
		          onReady={setLoaded}
		          //{...this.props}
		        />
		  	}</span>
	  	</span>
  	)
  }

}

export default Player