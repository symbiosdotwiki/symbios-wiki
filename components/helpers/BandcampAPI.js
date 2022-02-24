export var getBCImg = function(bc, imgLoaded) {
  let img = new Image()
  img.onload = function() {
    imgLoaded(img)
  }
  img.src = bc.img
}


const bcURL = "http://bandcamp.com/api/mobile/24/tralbum_details?band_id=1&tralbum_type=t&tralbum_id="

export var getBCImg2 = function(bc, imgLoaded) {
  var parts = bc.toString().split('/');
  var lastSegment = parts.pop() || parts.pop()
  fetch(bcURL + lastSegment, {
    mode: 'cors',
    method: 'get',
  }).then(response => response.json())
    .then(data => {
      console.log(data)
      // let img = new Image()
      // img.onload = function() {
      //   imgLoaded(img)
      // }
      // img.src = data.thumbnail_url
    })
}

// var elmnt = iframe.contentWindow.document.getElementsByTagName("H1")