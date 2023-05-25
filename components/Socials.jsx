import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSoundcloud, faInstagram, faBandcamp, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

class Socials extends Component {

  animLength = 1
  firstTime = 0

  links = {
    sc: "https://soundcloud.com/isaka_symbios_wiki",
    bc: "https://isomov.bandcamp.com/",
    gh: "https://github.com/symbiosdotwiki",
    tw: "https://twitter.com/symbios_wiki",
    in: "https://www.instagram.com/symbios.wiki/"
  }

  // router = useRouter()

  // handleClick() {
  //   router.push("https://soundcloud.com/isaka_symbios_wiki")
  // }

  constructor(props){
    super(props)
    this.firstTime = this.props.getTime()
     this.animDelay = this.props.animDelay.bind(this)
  }

  openPage(url){
    window.open(url, "_blank")
  }

  render(){
    const { onClick, expanded, animLength } = this.props
    const { animDelay, links } = this
    return(
      <div className="social">

          <FontAwesomeIcon 
            className="soundcloud fa-lg" 
            icon={faSoundcloud} 
            style={animDelay([animLength])}
            onClick={() => this.openPage(links.sc)}
          />
       
          <FontAwesomeIcon 
            className="instagram fa-lg" 
            icon={faInstagram} 
            style={animDelay([animLength])}
            onClick={() => this.openPage(links.in)}
          />

          <FontAwesomeIcon 
            className="twitter fa-lg" 
            icon={faTwitter} 
            style={animDelay([animLength])}
            onClick={() => this.openPage(links.tw)}
          />

          <FontAwesomeIcon 
            className="bandcamp fa-lg" 
            icon={faBandcamp} 
            style={animDelay([animLength])}
            onClick={() => this.openPage(links.bc)}
          />

          <FontAwesomeIcon 
            className="github fa-lg" 
            icon={faGithub} 
            style={animDelay([animLength])}
            onClick={() => this.openPage(links.gh)}
          />

      </div>
    )
  }

}
export default Socials 
