import React, { Component, createRef } from 'react'

import Markdown from './helpers/Markdown'
import ReactMarkdown from "react-markdown"

import ReactPlayer from 'react-player'
import BandcampPlayer from 'react-bandcamp'
import { Col, Spinner } from 'react-bootstrap'

import { getFlickrGallery, getFlickrImg } from './helpers/FlickrAPI.js'

import SmallArrowSVG from '../svg/arrowS.svg'
import ArrowSVG from '../svg/arrow.svg'
import XPlus from './xPlus'
import MinimizeSVG from '../svg/mini.svg'


import { 
  FaBiohazard, FaRadiationAlt, FaSeedling, FaYinYang, FaTrangenderAlt, FaLeaf
} from 'react-icons/fa'

import buildUrl from 'build-url'

import SymbiosSpinner from './SymbiosSpinner'
import Player from './Player'

// var SC = require('static/scripts/sc.js')

const spinnerTime = 2

const isBrowser = typeof window !== "undefined"

// const PlayerSlide = ({ url, isSelected }: { url: string; isSelected?: boolean }) => (
//     <Player width="100%" url={url} playing={isSelected} />
// );

class PostViewer extends Component {

  state = {
    img: null,
    shown: false,
    loaded: false,
    carousel: [],
    carIdx:0,
    fullscreen: false,
    ratio: 1,
    maxDim: [80, 60],
    portrait: false
  }

  mdfp = [95, 80]
  mdp = [90, 60]
  mdfl = [85, 95]
  mdl = [80, 60]

  animLength = 1
  firstTime = 0

  photoset = null

  touchstartX = 0
  touchendX = 0

  pageRef = null
  carRef = null

  constructor(props) {
    super(props)

    const {post} = props
    if(this.props.post.data){
      this.photoset = this.props.post.data.photoset
    }
    this.animDelay = this.props.animDelay.bind(this)
    this.firstTime = this.props.getTime()

    this.carRef = createRef()
    this.pageRef = createRef()

    let maxdim = this.getMaxDim()

    let ratio = post && post.img ? 
      post.img.width / post.img.height : 
      maxdim.maxDim[0] / maxdim.maxDim[1]

    this.state = {
      ...this.state,
      ratio: ratio,
      ...maxdim
    }
  }

  setCarousel = (cList, callback) => {
    const { post } = this.props
    const { content, data, img } = post
    const { 
      image, video, sound, bandcamp, iframe, photoset, carousel
    } = data

    let carouselList = []

    if(video && video.youtube){
      let videoURL = 'https://www.youtube.com/watch?v='
      videoURL += video.id.toString().split('?v=').pop()
      carouselList.push(videoURL)
    }
    else if(video){
      videoURL = 'https://www.vimeo.com/'
      videoURL += video.id.toString().split('/').pop()
      carouselList.push(videoURL)
    }
    if(iframe){
      carouselList.push(iframe.toString())
    }
    if(bandcamp){
      carouselList.push(bandcamp.id.toString())
    }
    if(sound && sound.url){
      carouselList.push(sound.url.toString())
    }
    
    carouselList = carouselList.concat(cList)
    carouselList = carousel ? carouselList.concat(carousel) : carouselList
    this.setState({
      carousel: carouselList
    }, () => callback())

    // console.log(carouselList)

  }

  setRatio = (ratio) => {
    // console.log(ratio)
    this.setState({ratio:ratio})
  }

  getMaxDim = (swap=false) => {
    const {fullscreen} = this.state
    let fs = swap ? !fullscreen : fullscreen
    // if (window.matchMedia("(max-aspect-ratio: 11/10)").matches) {
    if (window.matchMedia("(max-width: 720)").matches) {
      // console.log("portrait")
      return {
        portrait: true,
        maxDim: fs ? this.mdfp : this.mdp
      }
    } else {
      // console.log("landscape")
      return {
        portrait: false,
        maxDim: fs ? this.mdfl : this.mdl
      }
    }
  }

  nextCar = () => {
    this.setState({
      carIdx: Math.min(this.state.carousel.length-1, this.state.carIdx+1)
    })
  }
  prevCar = () => {
    this.setState({
      carIdx: Math.max(0, this.state.carIdx-1)
    })
  }

  toggleFullscreen = () => {
    let fsSwap = !this.state.fullscreen
    let maxDim = this.getMaxDim(true)
    this.setState({
      fullscreen: fsSwap,
      ...maxDim
    }, () => console.log(this.state))
  }

  handleGesture = (type) => {
    const {touchstartX, touchendX} = this
    const sensitivity = 5;
    if(type == 'page'){
      if( touchstartX - touchendX > sensitivity){
        this.props.nextPost()
      }
      else if( touchstartX - touchendX < -sensitivity){
        this.props.prevPost()
      }
    }
    if(type == 'car'){
      if( touchstartX - touchendX > sensitivity){
        this.nextCar()
      }
      else if( touchstartX - touchendX < -sensitivity){
        this.prevCar()
      }
    }
  }

  handleResize = (e) => {
    this.setState(this.getMaxDim())
  }

  componentDidMount() {
    const { post } = this.props
    const { content, data, img } = post
    const { 
      title, image, video, sound, bandcamp, iframe, photoset, carousel
    } = data

    if (isBrowser && this.pageRef && this.pageRef.current) {
      this.pageRef.current.addEventListener('touchstart', e => {
        this.touchstartX = e.changedTouches[0].screenX
      })
      this.pageRef.current.addEventListener('touchend', e => {
        this.touchendX = e.changedTouches[0].screenX
        this.handleGesture('page')
      })
    }

    if (isBrowser && this.carRef && this.carRef.current) {
      this.carRef.current.addEventListener('touchstart', e => {
        e.stopPropagation()
        this.touchstartX = e.changedTouches[0].screenX
      })
      this.carRef.current.addEventListener('touchend', e => {
        e.stopPropagation()
        this.touchendX = e.changedTouches[0].screenX
        this.handleGesture('car')
      })
    }

    if(isBrowser){
      window.addEventListener('resize', this.handleResize)
    }


      this.setCarousel([], () =>{
        if(photoset){
          getFlickrGallery(
            photoset.id.toString().split("/").pop(), 
            (response) => {
              this.setCarousel(response, ()=>{})
            }
          )
        }
        else if(image){
          getFlickrImg(
            image.id.toString().split("/").pop(),
            'Original',
            (response) => {
              this.setCarousel([response], ()=>{})
            },
            true
          )
        }
      })
  }

  carouselRenderItem = (item, props) => <item.type {...item.props} {...props} />

  render(){
    // const { img, shown } = this.state
    const { 
      post, clickBack, nextPost, prevPost, isSelected,
      hasNext, hasPrev, getTime, animLength
    } = this.props
    const { content, data, img } = post
    const { loaded, carousel, carIdx, fullscreen, ratio, maxDim } = this.state
    const {animDelay, setRatio} = this

    // console.log(post)

    let spinny = loaded || img

    const { title, image, video, sound, bandcamp, iframe, photoset } = data

    let titleSize = 80 / title.length * 1.5

    // let ratio = img ? img.width / img.height : 1;

    let hasNextC = carIdx < carousel.length - 1
    let hasPrevC = carIdx > 0

    let maxWidth = maxDim ? maxDim[0] : 80;
    let maxHeight = maxDim ? maxDim[1] : 60;

    return (
      <div 
        className={"post-stuff " + (fullscreen ? "fullscreen" : '')}
        style={animDelay([animLength])}
        ref={this.pageRef}
      >         

        <div 
          className="post-title-lg"
          style={{
            top: `calc(9vh - min(${titleSize}vw,6vh) / 1)`,
            fontSize: `min(${titleSize}vw,6vh)`,
            ...animDelay([animLength])
          }}
        >
          <span>{data.title}</span>
        </div>

        <div 
          className="post-markdown"
          style={{
            top: `calc(24% + min(${maxWidth / ratio}vw, ${maxHeight}\%))`
          }}
        >
          <ReactMarkdown 
            className="description"
          >
            {content}
          </ReactMarkdown>
        </div>

      
        {/*<button 
            onClick={() => clickBack(null)}
            className="postBackButton postButton"
            style={animDelay([animLength])}
          > 
            BACK 
          </button>*/}

          <MinimizeSVG 
            onClick={() => clickBack(null)}
            className="postBackButton postButton"
            style={animDelay([animLength])}
          /> 

        <ArrowSVG 
          onClick={nextPost}
          className={
            "nextPostButton postButton " + (hasNext ? '' : 'hidden')
          }
          style={animDelay([animLength])}
        /> 
          
        <ArrowSVG
          onClick={prevPost}
          className={
            "prevPostButton postButton " + (hasPrev ? '' : 'hidden')
          }
          style={animDelay([animLength])}
        />  

           <div 
            className="fullscreen-cover"
            style={animDelay([animLength])}
          />

           <div 
            className="post-player-div"
            style={{
              ...animDelay([animLength]),
              width: `min(${maxWidth}vw, ${maxHeight * ratio}vh)`,
              height: `min(${maxWidth / ratio}vw, ${maxHeight}\%)`
            }}
            ref={this.carRef}
          >
        {isSelected ? 
          <Player
            url={carousel[carIdx] ? carousel[carIdx] : ''}
            animDelay={this.props.animDelay}
            getTime={getTime}
            animLength={animLength}
            ratio={ratio}
            setRatio={setRatio}
            key={carIdx}
            maxDim={maxDim}
          /> : ''
        }

         <SmallArrowSVG 
            onClick={this.nextCar}
            className={
              "nextCarButton postButton " + (hasNextC ? '' : 'hidden')
            }
            style={animDelay([animLength])}
          /> 
           

          <SmallArrowSVG 
            onClick={this.prevCar}
            className={
              "prevCarButton postButton " + (hasPrevC ? '' : 'hidden')
            }
            style={animDelay([animLength])}
          /> 
            

          <XPlus 
            onClick={this.toggleFullscreen}
            animDelay={this.props.animDelay}
            animLength={animLength}
            expanded={fullscreen}
            getTime={getTime}
          />
           {/*<button 
            onClick={this.toggleFullscreen}
            className="fullscreenButton"
          > 
            {"FULL"}
          </button>*/}
        </div>


          

      </div>
    )
  }

}
export default PostViewer 
