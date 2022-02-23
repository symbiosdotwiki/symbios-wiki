import React, { Component } from 'react'

import Markdown from './helpers/Markdown'
import ReactMarkdown from "react-markdown"

import ReactPlayer from 'react-player'
import { Col, Spinner } from 'react-bootstrap'

import { getFlickrImg } from './helpers/FlickrAPI.js'
import { 
  getSoundCloudImg, scIF, scURL, getSoundCloudImg2 
} from './helpers/SoundCloudAPI.js'
import { getVimeoImg, viF } from './helpers/VimeoAPI.js'
import { getYTImg } from './helpers/YouTubeAPI.js'
import { getBCImg } from './helpers/BandcampAPI.js'


import { 
  FaBiohazard, FaRadiationAlt, FaSeedling, FaYinYang, FaTrangenderAlt, FaLeaf
} from 'react-icons/fa'

import BandcampPlayer from 'react-bandcamp'

import buildUrl from 'build-url'

import SymbiosSpinner from './SymbiosSpinner'

// var SC = require('static/scripts/sc.js')

const spinnerTime = 2

class SquareImg extends Component {

  render(){
    const { img, data, animDelay, animLength, ID, postClick } = this.props
    // if(img)
      return (
        <span
          onClick={(e) => postClick(e, ID)}
        >
            <SymbiosSpinner 
              animDelay={animDelay}
              loaded={img}
              spinnerTime={spinnerTime}
              size={'1'}
            />

           <div 
            className={"teaser-square" + (img ? '' : ' disable-hover')}
            style={animDelay([animLength])}
          >
            <span className={"hidden " + (img ? 'shown' :'')}>
              
              
              { img ? 
                <div
                  className='teaser-img'
                  style={{ 
                    backgroundImage: 'url(\"' + img.src + '\")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center', 
                    backgroundRepeat: 'no-repeat'
                  }}
                /> : ''
              }
               <ReactMarkdown 
                className="description"
              >
                {data.blurb}
              </ReactMarkdown>
            </span>
          </div>

          
         
      </span>
    )
  }
}

class PostPreview extends Component {

  state = {
    img: null,
    shown: false
  }

  animLength = 1
  firstTime = 0

  constructor(props) {
    super(props)

    this.iRef = React.createRef()
    this.imgRef = React.createRef()
    this.animDelay = this.props.animDelay.bind(this)
    this.firstTime = this.props.getTime()
    // console.log(this.animLength)
  }

  componentDidMount() {
    const { content, data, img, SC, Vimeo } = this.props
    const { 
      title, image, video, audio, sound, bandcamp, img_url 
    } = data

    // console.log(SC)

    let img_type = null
    let img_id = null
    if(typeof img_url == 'string'){
      if(img_url.indexOf('flickr') > -1){
        img_url.split('/')[-1]
      }
      else if(img_url.indexOf('vimeo') > -1){
        
      }
      else if(img_url.indexOf('youtube') > -1){
        
      }
      else if(img_url.indexOf('soundcloud') > -1){
        let s_url = img_url//.replace('https://', 'http://api.')
        getSoundCloudImg2(
          s_url, (img) => this.imgLoaded(img)
        )
        console.log("after SC")
      }
    }
    // console.log(img_id)

    // if(!img && image){
    //   getFlickrImg(image.id, "Medium", (img) => this.imgLoaded(img))
    // }
    // else if(!img && sound){
    //   getSoundCloudImg(
    //     SC, this.iRef.current, sound, (img) => this.imgLoaded(img)
    //   )
    // }
    // else if(!img && video && !video.youtube){
    //   getVimeoImg(
    //     video, (img) => this.imgLoaded(img)
    //   )
    // }
    // else if(!img && video && video.youtube){
    //   getYTImg(
    //     video, (img) => this.imgLoaded(img)
    //   )
    // }
    // else if(!img && bandcamp){
    //   getBCImg(
    //     bandcamp, (img) => this.imgLoaded(img)
    //   )
    // }
    // else if(img){
    //   this.setState({img: img})
    // }

    setTimeout(()=>{
      this.setState({shown:true})
    }, 1)
  }

  imgLoaded = (img) => {
    const { saveImage } = this.props
    saveImage(img)
    if(this.checkIfMounted()){
      this.setState({img:img})
    }
  }

  checkIfMounted = () => {
     return this.imgRef.current != null;
  }

  render(){
    const { img, shown } = this.state
    const { 
      content, data, getTime, animLength, postClick, ID 
    } = this.props
    const { title, image, video, sound, bandcamp } = data
    const { animDelay } = this

    return (
      <Col 
        xs={12}
        md={6}
        lg={4}
        xl={3}
        className="post-teaser"
        style={animDelay([animLength])}
        ref={this.imgRef} 
      >
        <div 
          className={"teaser-square-container hidden-teaser " + (shown ? 'shown-teaser' : '')}
        >
          <SquareImg 
            data={data}
            img={img}
            animDelay={animDelay}
            animLength={animLength}
            postClick={postClick}
            ID={ID}
          />
        </div>
        <div className="post-title">
          {title}
        </div>
        {//img ? '' : 
          //sound ? 
          <iframe 
            ref={this.iRef} 
            src={scIF + '?url=' + scURL + '123'}
            style={{'display':'block', 'visibility':'hidden'}}
          /> //: ''
          // bandcamp ?
          // <iframe 
          //   ref={this.iRef} 
          //   src={bandcamp.url}
          //   style={{'display':'block', 'visibility':'hidden'}}
          // /> : ''
          // <BandcampPlayer album={bandcamp.id} /> : ''
        }
      </Col>
    )
  }

}
export default PostPreview 
