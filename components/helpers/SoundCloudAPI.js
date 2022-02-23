import { getSDK } from 'react-player/lib/utils'

const SDK_URL = 'https://w.soundcloud.com/player/api.js'
const SDK_GLOBAL = 'SC'

export const scIF = "https://w.soundcloud.com/player/"
export const scURL = "https://api.soundcloud.com/playlists/"
export const scURLurl = "https://soundcloud.com/oembed?format=json&url="

export var getSC = function(callback) {
  getSDK(SDK_URL, SDK_GLOBAL).then(SC => {
    callback(SC)
  })
}

export var getSoundCloudWidget = function(iframe, callback) {
  getSDK(SDK_URL, SDK_GLOBAL).then(SC => {
    // iframe.src = scIF + '?url=' + scURL
    let widget = SC.Widget(iframe)
    callback(widget)
  })
}

export var getSoundCloudImg = function(SC, iframe, sound, imgLoaded) {
    let widget = SC.Widget(iframe)
    widget.load(scURL + sound.id, {
      callback: () => {
      
      widget.getCurrentSound((music) => {
        if(!music.artwork_url){
          return false
        }
        let artwork_url = music.artwork_url.replace('-large', '-t500x500')
        let img = new Image()
        img.onload = function() {
          imgLoaded(img)
        }
        img.src = artwork_url
      })
    }})
}

export var getSoundCloudImg2 = function(sound_url, imgLoaded) {
    fetch(scURLurl + sound_url, {
      method: 'get',
      cache: 'no-cache', 
      mode: 'cors',
    }).then(response => response.json())
      .then(data => {
        let img = new Image()
        img.onload = function() {
          imgLoaded(img)
        }
        img.src = data.thumbnail_url
      })
}