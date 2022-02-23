import React, { Component } from 'react'

import Markdown from './helpers/Markdown'
import ReactMarkdown from "react-markdown"

import ReactPlayer from 'react-player'
import BandcampPlayer from 'react-bandcamp'
import { Col, Spinner } from 'react-bootstrap'

import { getFlickrGallery } from './helpers/FlickrAPI.js'


import { 
  FaBiohazard, FaRadiationAlt, FaSeedling, FaYinYang, FaTrangenderAlt, FaLeaf
} from 'react-icons/fa'

import buildUrl from 'build-url'

import SymbiosSpinner from './SymbiosSpinner'
import Player from './Player'

// var SC = require('static/scripts/sc.js')

const spinnerTime = 2

class PostViewer extends Component {

  state = {
    img: null,
    shown: false,
    laoded: false,
  }

  animLength = 1
  firstTime = 0


  render(){
    // const { img, shown } = this.state
    const { post, animDelay, getTime } = this.props
    const { content, data, img } = post
    const { loaded } = this.state

    // console.log(post)

    let spinny = loaded || img

    const { title, image, video, sound, bandcamp, iframe, photoset } = data

    let playerType = ''
    let ID = ''
    let playlist = false

    if(photoset){
          getFlickrGallery(photoset.id.split("/").pop(), '', ()=>{})
    }


    if(video){
      ID = video.id.toString()
      playerType = video.youtube ? 'youtube' : 'vimeo'
    }
    else if(iframe){
      ID = iframe.toString()
      playerType = 'iframe'
    }
    else if(bandcamp){
      ID = bandcamp.id.toString()
      playerType = 'bandcamp'
    }
    else if(sound){
      ID = sound.url ? sound.url.toString() : ''
      playerType = 'soundcloud'
      playlist = sound.type == "playlists"
    }

    // 
    // const { animDelay } = this

    return (
      <div>
        <div>
          {data.title}
        </div>

        <div className="post-markdown">
          <ReactMarkdown 
                className="description"
              >
                {content}
              </ReactMarkdown>
        </div>


        <Player
          ID={ID}
          playerType={playerType}
          playlist={playlist}
          animDelay={animDelay}
          getTime={getTime}
        />

       {/* <iframe 
        style="border: 0; width: 350px; height: 470px;" 
        src="https://bandcamp.com/EmbeddedPlayer/
          album=2780555833/size=large/
          bgcol=242626/
          linkcol=1a87e2/tracklist=false/transparent=true/" seamless>
          <a href="https://isomov.bandcamp.com/album/in-theory">
          In Theory by Isomov</a></iframe>
*/}
      </div>
    )
  }

}
export default PostViewer 
