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
		setTimeout( () =>
			this.setState({
				loaded: true
			}), 10)
	}

	constructor(props) {
    super(props)

    this.animDelay = this.props.animDelay.bind(this)
    this.firstTime = this.props.getTime()

  }

  componentDidUpdate(prevProps) {
	  if (prevProps.ID !== this.props.ID) {
	    this.setState({loaded: false})
	  }
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
  		<div className="post-player">
	  		<SymbiosSpinner 
	        animDelay={animDelay}
	        loaded={loaded}
	        spinnerTime={spinnerTime}
	        size={'50'}
	      />
	      <div className={"player-iframe player-hidden " + (loaded ? "player-loaded" : '')}>{
		      playerType == 'iframe' ?
		        <iframe 
		        	src={ID}
		        	onLoad={setLoaded}
		        	width='100%'
		          height='100%'
		        /> :
		      playerType == 'bandcamp' ?
		        <BandcampPlayer 
		          album={ID.toString()} 
		          artwork="big"
		          width="40vmin"
		          height="55vmin"
		          bgcol="242626"
		          onLoad={setLoaded}
		        /> :
		      	<ReactPlayer 
		          url={URL} 
		          onReady={setLoaded}
		          controls={true}
		          playing={true}
		          width='100%'
		          height='100%'
		          loop={true}
		        />
		  	}</div>
	  	</div>
  	)
  }

}

export default Player