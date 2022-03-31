import buildUrl from 'build-url'

var generateApiUrl = function(image, size) {
  // const extras = ["url_o", "url_m", props.thumbnailSizeParam, "license", "date_upload", "date_taken", "icon_server", "original_format", "last_update", "geo", "tags", "machine_tags", "o_dims", "views", "media", "path_alias", "owner_name"];
  return buildUrl('https://api.flickr.com', {
    path: 'services/rest/',
    queryParams: {
      method: 'flickr.photos.getSizes',
      format: 'json',
      api_key: process.env.NEXT_PUBLIC_REACT_APP_FLICKR_api_key || '',
      photo_id: image || '',
      // user_id: props.user_id || '',
      // album_id: props.album_id || '',
      nojsoncallback: '?',
      // extras: extras.join(',')
    }
  })
}

export var getFlickrImg = function(image, size, imgLoaded, onlySrc) {
  var parts = image.toString().split('/');
  var lastSegment = parts.pop() || parts.pop()
  // console.log(lastSegment)
  let imageID = image.toString().indexOf('flickr') > -1 ? lastSegment : image
  fetch(generateApiUrl(imageID, size))
  .then(response => response.json())
  .then((response) => {
    // console.log(response)
    if(response.stat == 'fail'){
      console.log(imageID)
      console.log(response)
    }
    else{
    // console.log(response)
    let imgSrc = response.sizes.size.filter(
      obj => {
        return obj.label === size
      }
    )
    if(imgSrc.length == 0){
      imgSrc = response.sizes.size.filter(
        obj => {
          return obj.label === "Thumbnail"
        }
      )
    }
    // console.log(response.sizes.size)
    if(onlySrc){
      imgLoaded(imgSrc[0].source)
    }
    else{
      imgSrc = imgSrc[0].source
      let img = new Image()
      img.onload = function() {
        imgLoaded(img)
      }
      img.src = imgSrc
    }
  }
    // console.log(imgSrc)
  })
}

var generateGalleryApiUrl = function(photoset) {
  var parts = photoset.toString().split('/');
  var lastSegment = parts.pop() || parts.pop()
  // console.log(lastSegment)
  let setID = photoset.toString().indexOf('flickr') > -1 ? lastSegment : photoset
  // const extras = ["url_o", "url_m", props.thumbnailSizeParam, "license", "date_upload", "date_taken", "icon_server", "original_format", "last_update", "geo", "tags", "machine_tags", "o_dims", "views", "media", "path_alias", "owner_name"];
  return buildUrl('https://api.flickr.com', {
    path: 'services/rest/',
    queryParams: {
      method: 'flickr.photosets.getPhotos',
      format: 'json',
      api_key: process.env.NEXT_PUBLIC_REACT_APP_FLICKR_api_key || '',
      photoset_id: setID || '',
      nojsoncallback: '?',
      extras: 'original_format',
      original_format: true
    }
  })
}

export var getFlickrGallery = function(photoset, loaded) {
  fetch(generateGalleryApiUrl(photoset))
  .then(response => response.json())
  .then((response) => {
    if(response.stat == 'fail'){
      console.log(photoset)
      console.log(response)
    }
    else{
      const photoURLs = response.photoset.photo.map(x => 
        `https://live.staticflickr.com/${x.server}/${x.id}_${x.originalsecret}_o.${x.originalformat}`
      );
      loaded(photoURLs)
  }
  })
}

export var getFlickrGalleryPrev = function(photoset, imgLoaded) {
  fetch(generateGalleryApiUrl(photoset))
  .then(response => response.json())
  .then((response) => {
    if(response.stat == 'fail'){
      console.log(photoset)
      console.log(response)
    }
    else{
      let x = response.photoset.photo[0]
      const photoURL = `https://live.staticflickr.com/${x.server}/${x.id}_${x.secret}.jpg`
      // console.log(photoURL)
      let img = new Image()
      img.onload = function() {
        imgLoaded(img)
      }
      img.src = photoURL
      // loaded(photoURL)
  }
  })
}

