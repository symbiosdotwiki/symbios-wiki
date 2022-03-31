import React, { Component, useEffect, createRef } from 'react'
// import ReactMarkdown from 'react-markdown'
import PostPreview from './PostPreview'
import PostViewer from './PostViewer'
import TagSelectorSimple from './TagSelectorSimple'
import SymbiosLoader from './SymbiosLoader'
import ScrollMore from "./ScrollMore"
import Header from './Header'
import Info from './Info'

import { Container, Row, Col } from 'react-bootstrap'
import InfiniteScrollFix from './InfiniteScrollFix'

import * as matter from 'gray-matter'

import { getSC } from './helpers/SoundCloudAPI'
import { getVimeo } from './helpers/VimeoAPI'

import Router from 'next/router'
import { useRouter, withRouter } from 'next/router'

const isBrowser = typeof window !== "undefined"


function findCommonElements(arr1, arr2) {
    return arr1.some(item => arr2.includes(item))
}

function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

let mdFiles = []
// Get Tags
let tagsLists = {}
let tags = {}
let tagFilters = {}


class Portfolio extends Component{

  allPosts = {}
  tagFilters = {}
  minPosts = 8

  showIntro = true
  redirect = false
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

  mobile = false

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
    },
    zoomedOut:true,
    postTitle: ''
  }

  constructor(props) {
    super(props)

    const {router, tags, tagFilters} = props

    this.iRef = createRef()
    this.contRef = createRef()

    this.allPosts = props.allPosts
    // this.tagFilters = props.tagFilters

    this.resizeStuff()

    let wDim = [0,0]
    
    if (isBrowser) {
      document.body.classList.add("bg-rainbow")
      this.animLength = parseFloat(
        getComputedStyle(document.body).animationDuration
      )
      window.addEventListener('resize', () => {
        this.stopTrans()
        this.resizeStuff()
      })
      wDim = [window.innerWidth/2, window.innerHeight/2]

      this.mobile = isMobile()
    }

    const urlPar = '?' + router.asPath.split('?').pop()
    const params = new Proxy(new URLSearchParams(urlPar), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const queryPost = router.query.post || params.post
    const queryFilter = router.query.filter || params.filter
    const queryInfo = router.query.i || params.i

    if(queryFilter && tags.categories.hasOwnProperty(queryFilter)){
      tags.categories[queryFilter] = true
      tagFilters.categories = [queryFilter]
    }

    this.tagFilters = tagFilters

    this.state = {
      ...this.state,
      tags: tags,
      postXY: {
        "transformOrigin" : `${wDim[0]}px ${wDim[1]}px`
      },
    }

    let posts = this.filterPosts()
    let newIDX = queryPost ? 
    posts.findIndex(
        p => p.data.title == queryPost
      ) : null
    newIDX = newIDX > -1 ? newIDX : null

     this.showIntro = this.showIntro && newIDX == null
    // console.log(newIDX, posts)

    this.state = {
      ...this.state,
      postID: newIDX,
      post: newIDX !== null,
      postTitle: queryPost,
      zoomedOut: newIDX == null,
      posts:posts,
      numPosts: Math.min(this.minPosts, posts.length),
      info: queryInfo == '1',
    }
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
    // console.log(this.redirect)
    setTimeout(()=>{
      if(this.redirect && this.showIntro && isBrowser){
        window.location.href = this.redirect_url
      }
      else{
        this.setState({intro:false})
      }
    }, this.showIntro ? this.introTime*1000 : 10)

    //  let posts = this.filterPosts()
    // this.setState({
    //   posts:posts,
    //   numPosts: Math.min(this.minPosts, posts.length)
    // })
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

    // console.log("filter", tags)
    // console.log(tagFilters)

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

    this.setState(newState, this.setPostURL)    
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
    this.setState({info:!this.state.info}, this.setPostURL)
    // console.log('hi')
  }

  setPostURL = () => {
    const {posts, tags, postID, post, info} = this.state
    let queries = {}
    // console.log(post, postID, posts)
    if(post && postID < posts.length){
      let postTitle = posts[postID].data.title
      queries.post = postTitle
    }
    let cats = tags.categories
    let catTag = Object.keys(cats).find(key => cats[key])
    if(catTag){
      queries.filter = catTag
    }
    if(info){
      queries.i = 1
    }
    // console.log(postID, queries)
    Router.push({
      query: queries,
    })
    // this.setState({
    //   postTitle: postTitle
    // })
  }
  resetPostURL = () => {
    Router.push({})
  }

  postClick = (e, idx) => {
    // console.log(this.state.postID)
    let newIDX = idx != null ? idx : this.state.postID
    let postTitle = ''
    if(this.state.posts.length > 0 && this.allPosts[idx]){
      postTitle = this.allPosts[idx].data.title
      newIDX = this.state.posts.findIndex(
        p => p.data.title == postTitle
      )
      newIDX = newIDX > -1 ? newIDX : 0
    }

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
      zoomedOut: isPost ? false : this.state.zoomedOut,
      postTitle: postTitle,
    }, this.setPostURL)
    clearTimeout(this.zoomTimeout)
    this.zoomTimeout = setTimeout(()=>{
      this.setState({
        zooming: false,
        zoomedOut: !this.state.post
      })
    }, 750)
    // console.log('hi')
  }

  nextPost = () => {
    let postID = Math.min(this.state.posts.length-1, this.state.postID + 1)
    let postTitle = this.state.posts[postID].data.title
    if(this.state.numPosts <= this.state.postID + 1){
      this.addMorePosts()
    }
    this.setState({
      postID: postID,
      postTitle: postTitle,
      // zooming: true,
    }, this.setPostURL)
  }

  prevPost = () => {
    let postID = Math.max(0, this.state.postID - 1)
    let postTitle = this.state.posts[postID].data.title
    
    this.setState({
      postID: Math.max(0, this.state.postID - 1),
      postTitle: postTitle,
      // zooming: true,
    }, this.setPostURL)
  }

  render(){
    const { 
      posts, tags, types, numPosts, intro, menu, post, postID, info, 
      postXY, zooming, zoomedOut, postTitle
    } = this.state
    const { 
      tagFilter, tagSelect, selectedTags, addMorePosts, getTime, 
      menuClick, animDelay, animLength, postClick, allPosts, infoClick,
      nextPost, prevPost, mobile
    } = this

    const { queryPost, mainFile } = this.props

    // const router = useRouter()
    // console.log(this.props.router.query)

    // console.log(queryPost)
    // console.log('posts', posts)
    // console.log('all posts', allPosts)

    return (
      <div 
        ref={this.iRef}
        className={'main-cont noselect ' + (zooming ? 'zooming' : '')}
      >

      {mobile ? "" : 

       <svg xmlns="http://www.w3.org/2000/svg" id="turbFilter">
          <filter id="filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="linearRGB">
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
      }
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
          <Info
            infoClick={() => infoClick(null)}
            mainFile={mainFile}
            getTime={getTime}
            animLength={animLength}
            animDelay={animDelay}
          />
         
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
              <Row className="portfolio-row">
                {posts.slice(0, numPosts).map(
                  (file) => 
                    file.postPreview
                )}
                {numPosts < posts.length ? 
                  <ScrollMore
                    getTime={getTime}
                    animDelay={animDelay}
                    animLength={animLength}
                  /> : ''}
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
            infoClick={infoClick}
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
            key={postTitle}
            post={posts[postID] ? posts[postID] : allPosts[0]}
            getTime={getTime}
            animDelay={animDelay}
            animLength={animLength}
            clickBack={postClick}
            nextPost={nextPost}
            prevPost={prevPost}
            hasNext={postID < posts.length - 1}
            hasPrev={postID > 0}
            isSelected={!zoomedOut}
          />
        </div>

        
        </div>
       }

       </div>
    )
  }

}
export default withRouter(Portfolio)
