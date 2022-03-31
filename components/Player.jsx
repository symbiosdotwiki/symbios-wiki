import React, { Component, createRef } from 'react'

import ReactPlayer from 'react-player'
import BandcampPlayer from './BandcampPlayer'

import SymbiosSpinner from './SymbiosSpinner'

import { getVimeoImgRat } from './helpers/VimeoAPI.js'

class IFrame extends Component {
	iframeRef = null

	constructor(props) {
		super(props)
		this.iframeRef = React.createRef()
		this.animDelay = this.props.animDelay.bind(this)
    this.firstTime = this.props.getTime()
	}

	componentDidUpdate() {
    this.iframeRef.current.addEventListener('onload', () => this.props.onReady())
  }

	render(){
		const {animDelay} = this
		const {animLength} = this.props
		return (
			<iframe 
				ref={this.iframeRef}
				src={this.props.src}
				style={animDelay([animLength])}
			/>
		)
	}
}


class Player extends Component {

	state = {
		loaded: false
	}

	spinnerTime = 2
	loadTimeout = null

	playerRef = null
	imgRef = null
	bcRef = null

	ratio = 1

	imgRat = null

	ratioLoad = () => {
		this.ratio = this.imgRat.width / this.imgRat.height
		this.setState({
			loaded: true,
			// ratio: this.ratio
		})
		this.props.setRatio(this.ratio)
  }

  setPlayerType = () => {
  	const { url } = this.props
  	// console.log(url)
  	this.playerType = 
  		url.includes('youtube') ? 'youtube' :
  		url.includes('vimeo') ? 'vimeo' :
  		url.includes('soundcloud') ? 'soundcloud' :
  		url.includes('flickr') ? 'flickr' :
  		url.includes('http') ? 'iframe' :
  		url == '' ? '' :
  		'bandcamp'

  }

  openFullscreen = (elem) => {
	  if (elem.requestFullscreen) {
	    elem.requestFullscreen();
	  } else if (elem.webkitRequestFullscreen) { /* Safari */
	    elem.webkitRequestFullscreen();
	  } else if (elem.msRequestFullscreen) { /* IE11 */
	    elem.msRequestFullscreen();
	  }
	}

	constructor(props) {
    super(props)

    this.animDelay = this.props.animDelay.bind(this)
    this.firstTime = this.props.getTime()

    this.playerRef = createRef()
    this.imgRef = createRef()

    this.imgRat = new Image()
		this.imgRat.onload = () => {
			this.loadTimeout = setTimeout(this.ratioLoad , 20)
		}

		this.setPlayerType()

		// this.state = {
		// 	...this.state,
		// 	props.ratio
		// }
		this.ratio = props.ratio
  }

	setLoaded = () => {
		const { playerType } = this
		const { url, maxDim } = this.props
		this.ratio =  maxDim ? maxDim[0] / maxDim[1] : 1

		// console.log(playerType, this.playerRef.current)

		if(this.imgRef.current){
			this.imgRat.src = this.imgRef.current.src
		}
		else if(this.playerRef.current){
			if(playerType == 'youtube'){
				let ytID = url.split('?v=').pop()
				this.imgRat.src = `https://i.ytimg.com/vi/${ytID}/maxresdefault.jpg`
			}
			else if(playerType == 'vimeo'){
				getVimeoImgRat(url, (data) => {
					// console.log(data.width)
					this.ratio = data.width / data.height
					this.setState({
						loaded: true,
					})
					this.props.setRatio(this.ratio)
				})
			}
			else{
				this.ratio = 3
				this.setState({
					loaded: true,
				})
				this.props.setRatio(this.ratio)
			}
		}
		else{
			this.setState({
				loaded: true,
			})
			this.ratio = playerType == 'bandcamp' ? .7 : this.ratio
			this.props.setRatio(this.ratio)
		}

		
	}

  componentDidUpdate(prevProps) {
  	const { url } = this.props
  	this.setPlayerType()
	  if (prevProps.url !== url && prevProps != '') {
	  	// console.log('reset')
	  	// clearTimeout(this.loadTimeout)
	    this.setState({loaded: false})
	    
	  }
	}

  render(){
  	const { onReady, ID, isSelected, url, maxDim, animLength, getTime, ratio } = this.props
  	const { animDelay, spinnerTime, setLoaded, playerType } = this
  	const { loaded, thumbnail, photoUrl } = this.state

  	let widthRatio = ratio && ratio < 1 ? ratio : 1;
  	let heightRatio = ratio && ratio > 1 ? ratio : 1;

  	let maxWidth = maxDim ? maxDim[0] : 80;
  	let maxHeight = maxDim ? maxDim[1] : 60;
  	
  	return(
  		<div 
  			className="post-player"	
  			style={animDelay([animLength])}
  		>
	  		<SymbiosSpinner 
	        animDelay={this.props.animDelay}
	        animLength={animLength}
	        getTime={getTime}
	        loaded={loaded}
	        spinnerTime={spinnerTime}
	        size={'50'}
	      />
	      <div 
	      	className={"player-iframe player-hidden " + (loaded ? "player-loaded" : '')}
	      	style={animDelay([animLength])}
	      >{
		      playerType == 'iframe' ?
		        <iframe 
		        	src={url}
		        	onLoad={setLoaded}
		          width='100%'
		          height='100%'
		          style={animDelay([animLength])}
		        /> :
		      playerType == 'bandcamp' ?
		        <BandcampPlayer 
		          album={url.toString()} 
		          artwork="big"
		      //     width={`min(${maxWidth}vw, ${maxHeight * ratio}%)`}
		  				// height={`min(${maxWidth / ratio}vw, ${maxHeight}%)`}
		  				width='100%'
		  				height='100%'
		          bgcol="242626"
		          onLoad={setLoaded}
		          style={animDelay([animLength])}
		        /> :
		      playerType == 'flickr' ?
		      <div 
		      		className='player-wrapper'
		      		style={{
			  				// width: `min(${maxWidth}vw, ${maxHeight * ratio}%)`,
			  				// height: `min(${maxWidth / ratio}vw, ${maxHeight}%)`,
			  				width: '100%',
			  				height: '100%',
			  				...animDelay([animLength]),
			  				// maxWidth: `${60 * heightRatio}vh`,
			          // paddingBottom: `${100 / heightRatio}%`
			  			}}
		      	>
		      	<img ref={this.imgRef}
			      	src={url}
			      	onLoad={setLoaded}
			      	style={animDelay([animLength])}
			      	// onClick={() => this.openFullscreen(this.imgRef.current)}
			      /> 
			    </div>:
		      	<div 
		      		className='player-wrapper'
		      		style={{
			  				// width: `min(${maxWidth}vw, ${maxHeight * ratio}%)`,
			  				// height: `min(${maxWidth / ratio}vw, ${maxHeight}%)`,
			  				width: '100%',
			  				height: '100%',
			  				// maxWidth: `${60 * heightRatio}vh`,
			          // paddingBottom: `${100 / heightRatio}%`
			          ...animDelay([animLength])
			  			}}
		      	>
			      	<ReactPlayer 
			          url={url} 
			          onReady={setLoaded}
			          controls={true}
			          playing={true}
			          width='100%'
			          height='100%'
			          loop={true}
			          ref={this.playerRef}
			          style={animDelay([animLength])}
			        />
			       </div>
		  	}</div>
	  	</div>
  	)
  }

}

export default Player