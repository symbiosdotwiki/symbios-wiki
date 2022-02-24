import React, { Component, useEffect } from 'react'
// import ReactMarkdown from 'react-markdown'
import PostPreview from './PostPreview'
import PostViewer from './PostViewer'
import TagSelectorSimple from './TagSelectorSimple'
import SymbiosLoader from './SymbiosLoader'
import Header from './Header'

import { Container, Row, Col } from 'react-bootstrap'
import InfiniteScrollFix from './InfiniteScrollFix'

import * as matter from 'gray-matter'

import { getSC } from './helpers/SoundCloudAPI'
import { getVimeo } from './helpers/VimeoAPI'

const isBrowser = typeof window !== "undefined"


function findCommonElements(arr1, arr2) {
    return arr1.some(item => arr2.includes(item))
}

let mdFiles = []
// Get Tags
let tagsLists = {}
let tags = {}
let tagFilters = {}


class Portfolio extends Component {

  allPosts = {}
  tagFilters = {}
  minPosts = 8

  showIntro = true
  redirect = true
  redirect_url = "https://www.instagram.com/symbios.wiki"

  introTime = 8

  animLength = 30

  APIs = {}

  SC = null
  Vimeo = null
  YT = null
  BC = null

  TIME = 0
  zoomTimeout = null

  firstUpdate = false

  resizeTimer = null
  scrollTimer = null

  state = {
    posts: [],
    numPosts: 0,
    intro:true,
    menu: false,
    post: false,
    info: false,
    postID: 0,
    postXY: {
      "transformOrigin" : "0px 0px"
    }
  }

  constructor(props) {
    super(props)

    this.iRef = React.createRef()
    this.contRef = React.createRef()

    this.allPosts = props.allPosts
    this.tagFilters = props.tagFilters

    this.resizeStuff()
    
    if (isBrowser) {
      document.body.classList.add("bg-rainbow")
      this.animLength = parseFloat(
        getComputedStyle(document.body).animationDuration
      )
      window.addEventListener('resize', () => {
        this.stopTrans()
        this.resizeStuff()
      })
    }

    this.state = {
      ...this.state,
      tags: props.tags
    }

    // window.addEventListener('scroll', () => {
    //    this.stopHover()
    // }, false)

    // window.addEventListener('touchmove', () => {
    //    this.stopHover()
    // }, false)
  }

  stopHover = () => {
    if (isBrowser) {
      const filters = document.querySelectorAll('.teaser-square')
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer)
        this.scrollTimer = null
      }
      filters.forEach(node =>{
        if(!node.classList.contains('disable-hover')) {
          node.classList.add('disable-hover')
        }
      })
      this.scrollTimer = setTimeout(function(){
        filters.forEach(node =>{
          node.classList.remove('disable-hover')
          this.scrollTimer = null
        })
      }, 500)
    }
  }

  stopTrans = () => {
    if (isBrowser) {
      const classes = document.body.classList
      if (this.resizeTimer) {
            clearTimeout(this.resizeTimer)
            this.resizeTimer = null
        }
        else
            classes.add('stop-transitions');

        this.resizeTimer = setTimeout(() => {
            classes.remove('stop-transitions')
            this.resizeTimer = null
        }, 100)
      }
  }

  resizeStuff = () => {
    if(isBrowser){
      var root = document.documentElement
      // console.log(x)
      var w = window.innerWidth
      var h = window.innerHeight

      // var menuWidth = Math.min(.2 * w, )

      let newWidth = (w - .25*w) / w
      let newHeight = 100 / newWidth
      let offHeight = 50 * (1 - newWidth)
      root.style.setProperty(
        '--scale-filter',
        'translate(25vw, -' + offHeight.toString() + 'vh) scale(' + newWidth.toString() + ')'
      )
      root.style.setProperty(
        '--scale-filter-height',
        newHeight.toString() + 'vh'
      )
    }
  }

  componentDidMount() {
    getSC((SC) => {
      this.SC = SC
      getVimeo((Vimeo) => {
        this.Vimeo = Vimeo
        let posts = this.filterPosts()
        this.setState({
          posts:posts,
          numPosts: Math.min(this.minPosts, posts.length)
        })
      })
    })
    requestAnimationFrame(this.setTime)
    console.log(this.redirect)
    setTimeout(()=>{
      if(this.redirect && this.showIntro && isBrowser){
        window.location.href = this.redirect_url
      }
      else{
        this.setState({intro:false})
      }
    }, this.showIntro ? this.introTime*1000 : 10)
  }

  componentDidUpdate() {
    // console.log(this.contRef)
    if(this.contRef.current && !this.firstUpdate){
      this.contRef.current.addEventListener('scroll', () => {
        // this.stopTrans()
        this.stopHover()
      }, false)
      this.firstUpdate = true
      // console.log('hi')
    }
  }

  animDelay = function(animLength, getTimeAgain = false) {
    const { getTime } = this.props
    const theTime = getTimeAgain ? getTime() : this.firstTime
    let animDelayStr = ''
    let animSec = animLength.map((item) => {
      // console.log(item)
      return ((-theTime)%item).toString() + 's'
    })
  // console.log(animSec.join(', '))
    return { 
      animationDelay: animSec.join(', ')
    }
  }

  setTime = (time) => {
    // if(this.checkIfMounted()){
      this.TIME = time/1000
      // console.log(this.TIME)
      requestAnimationFrame(this.setTime)
    // }
  }

  getTime = () => {
    return this.TIME
  }

  saveImage = (idx, img) => {
    let { allPosts } = this
    allPosts[idx].img = img
  }

  postPreview = (file, idx) => {
    let { SC, Vimeo, getTime, animDelay, animLength, postClick } = this
    return <PostPreview 
        key={ file.data.title.toString() }
        ID = { idx }
        content={file.content}
        data={file.data}
        img={file.img}
        saveImage={(img)=>{this.saveImage(idx, img)}}
        SC={SC}
        Vimeo={Vimeo}
        getTime={getTime}
        animDelay={animDelay}
        animLength={animLength}
        postClick={postClick}
      />
  }

  filterPosts = () => {
    let { allPosts, tagFilters } = this
    const { tags } = this.state

    Object.keys(tagFilters).forEach(tagType => {
      if(tagFilters[tagType].length == 0){
        tagFilters[tagType] = Object.keys(tags[tagType])
      }
    })
    return allPosts.map( (file, idx) => {
      file.postPreview = this.postPreview(file, idx)
      return file
    }).filter((post) => 
      Object.keys(tagFilters).every(tagType => {
        let postTags = post.data.tags[tagType] ? post.data.tags[tagType] : ['NONE']
        return findCommonElements(postTags, tagFilters[tagType])
      })
    )
  }

  tagSelect = (tag, tagType) => {
    let { tags } = this.state
    let tagsOG = this.props.tags
    let newTags = JSON.parse(JSON.stringify(tagsOG))

    newTags[tagType][tag] = !tags[tagType][tag]
    this.tagFilters[tagType] = this.selectedTags(newTags[tagType])

    let posts = this.filterPosts()
    let newState = {
      posts: posts,
      tags: newTags,
      numPosts: Math.min(this.minPosts, posts.length)
    }

    this.setState(newState)    
  }

  selectedTags = (tags) => {
    return Object.keys(tags).filter(tag=>tags[tag]==true)
  }

  addMorePosts = () => {
    const { minPosts } = this
    const { numPosts, posts } = this.state
    this.setState({
        numPosts: Math.min(numPosts + minPosts, posts.length)
    })
    // console.log(Math.min(numPosts + minPosts, posts.length))
  }

  checkIfMounted = () => {
     return this.iRef.current != null;
  }

  menuClick = () => {
    this.setState({menu:!this.state.menu})
    // console.log('hi')
  }

  infoClick = () => {
    this.setState({info:!this.state.info})
    // console.log('hi')
  }

  postClick = (e, idx) => {
    // console.log(this.state.postID)
    let newIDX = idx != null ? idx : this.state.postID

    let postXY = this.state.postXY
    if(e){
      let tar = e.target;
      // let centerX = tar.offsetLeft + tar.offsetWidth / 2
      // let centerY = tar.offsetTop + tar.offsetHeight / 2

      let tarBound = tar.getBoundingClientRect()

      postXY = [
        tarBound.width/2 + tarBound.x, 
        tarBound.height/2 + tarBound.y
      ]

      // console.log(tar.getBoundingClientRect())
    }

    let postTransform = {
      "transformOrigin" : `${postXY[0]}px ${postXY[1]}px`
    }

    
    // console.log(postTransform)

    let isPost = idx != null ? true : false;

    this.setState({
      post: isPost,
      postID: newIDX,
      postXY: postTransform,
      zooming: true,
    })
    clearTimeout(this.zoomTimeout)
    this.zoomTimeout = setTimeout(()=>{
      this.setState({
        zooming: false,
      })
    }, 750)
    // console.log('hi')
  }

  render(){
    const { 
      posts, tags, types, numPosts, intro, menu, post, postID, info, 
      postXY, zooming
    } = this.state
    const { 
      tagFilter, tagSelect, selectedTags, addMorePosts, getTime, 
      menuClick, animDelay, animLength, postClick, allPosts, infoClick
    } = this

    return (
      <div 
        ref={this.iRef}
        className={zooming ? 'zooming' : ''}
      >

       <svg xmlns="http://www.w3.org/2000/svg" id="turbFilter">
          <filter id="filter" x="0%" y="0%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="linearRGB">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.003 0.003" 
              numOctaves="1" seed="2" 
              stitchTiles="noStitch" 
              result="turbulence"
            />
            <feColorMatrix in="turbulence" type="hueRotate" values="0" result="cloud">
              <animate attributeName="values" from="0" to="360" dur="4s" repeatCount="indefinite"/>
            </feColorMatrix>
            
            <feDisplacementMap in="SourceGraphic" in2="cloud" scale="100" xChannelSelector="G" yChannelSelector="A" result="displacementMap"/>
            <feGaussianBlur stdDeviation=".1" />
          </filter>
          </svg>
      
      {intro ? 
        <SymbiosLoader
          getTime={getTime}
          animLength={animLength}
          animDelay={animDelay}
        /> :

        <div className="max-cont">


        <div className={
          "infoViewerContainer" + (info ? " infoViewer-slide" : '')
        }>
          <div className="infoViewer"/>
          <button 
            onClick={() => infoClick(null)}
            className="infoBackButton"
          > 
            BACK 
          </button>
         
        </div>

        <Container 
        className={
            "ox-cont " 
            + (info ? " ox-cont-slide " : '') 
            + (post ? " ox-cont-zoom " : '')
          }
          style={postXY}
        >
          <div className={"tagKnobs " + (menu && "tagKnobs-slide")}>
          <div className="port-shad-cont"><div className="port-shad"/></div>
            <div className="tag-selector-knobs noselect">
              {/*Object.keys(tags).map( tagType =>*/}
                <TagSelectorSimple
                  key='categories'
                  tags={tags}
                  tagSelect={tagSelect}
                  tagType={'categories'}
                  getTime={getTime}
                  animDelay={animDelay}
                  animLength={animLength}
                />
              {/*})*/}
            </div>

            
          </div>


        <div 
          ref={this.contRef} 
          className={"portfolio-cont " + (menu && "portfolio-cont-slide")}
        >
        <div className="portfolio">
          {posts.length > 0 &&
            <InfiniteScrollFix
              dataLength={numPosts}
              next={addMorePosts}
              hasMore={numPosts < posts.length}
              loader={''}
            >
              <Row>
                {posts.slice(0, numPosts).map(
                  (file) => 
                    file.postPreview
                )}
                {numPosts < posts.length ? 
                  <Col 
                    xs={12}
                    md={6}
                    lg={4}
                    xl={3}
                    className="post-teaser"
                    ref={this.imgRef} 
                  >
                    Scroll to load more...
                  </Col> : ''}
                </Row>
              </InfiniteScrollFix>
            }
          </div>
          </div>

          <div 
            className={"header-cont " + (menu && "header-cont-slide")}
          >
           <Header
            getTime={getTime}
            animLength={animLength}
            menuClick={menuClick}
            animDelay={animDelay}
            expanded={menu}
            // animLength={animLength}
          />
          </div>

        </Container>

          <div 
          className={
            "postViewerContainer" + (post ? " postViewer-zoom" : '')
          }
          style={postXY}
        >
          <div className="postViewer"/>
          <PostViewer
            post={allPosts[postID]}
            getTime={getTime}
            animDelay={animDelay}
            animLength={animLength}
            clickBack={postClick}
          />
        </div>

        
        </div>
       }

       </div>
    )
  }

}
export default Portfolio 
