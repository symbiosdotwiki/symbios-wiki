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

export var getFlickrImg = function(image, size, imgLoaded) {
  fetch(generateApiUrl(image, size))
  .then(response => response.json())
  .then((response) => {
    if(response.stat == 'fail'){
      console.log(image)
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
    imgSrc = imgSrc[0].source
    let img = new Image()
    img.onload = function() {
      imgLoaded(img)
    }
    img.src = imgSrc
  }
    // console.log(imgSrc)
  })
}

var generateGalleryApiUrl = function(photoset, size) {
  // const extras = ["url_o", "url_m", props.thumbnailSizeParam, "license", "date_upload", "date_taken", "icon_server", "original_format", "last_update", "geo", "tags", "machine_tags", "o_dims", "views", "media", "path_alias", "owner_name"];
  return buildUrl('https://api.flickr.com', {
    path: 'services/rest/',
    queryParams: {
      method: 'flickr.photosets.getPhotos',
      format: 'json',
      api_key: process.env.NEXT_PUBLIC_REACT_APP_FLICKR_api_key || '',
      photoset_id: photoset || '',
      nojsoncallback: '?',
    }
  })
}

export var getFlickrGallery = function(photoset, size, loaded) {
  fetch(generateGalleryApiUrl(photoset, size))
  .then(response => response.json())
  .then((response) => {
    if(response.stat == 'fail'){
      console.log(photoset)
      console.log(response)
    }
    else{
    console.log(response)
    // let imgSrc = response.sizes.size.filter(
    //   obj => {
    //     return obj.label === size
    //   }
    // )
    // if(imgSrc.length == 0){
    //   imgSrc = response.sizes.size.filter(
    //     obj => {
    //       return obj.label === "Thumbnail"
    //     }
    //   )
    // }
    // // console.log(response.sizes.size)
    // imgSrc = imgSrc[0].source
    let img = new Image()
    img.onload = function() {
      loaded(img)
    }
    // img.src = imgSrc
  }
    // console.log(imgSrc)
  })
}