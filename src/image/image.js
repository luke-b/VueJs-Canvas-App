var imgWidth = 500,  // image max width in px
    imgHeight = 500,
    mosaicRes = 16, // px
    borderThickness = 10;  // image border thickness in px


// entry point function:
// processImageFile(imageFileNameString);


var processImageFile = function(fileName) {
     if(fileName && typeof FileReader !== "undefined") {
        readFile(fileName);
     }
}

var readFile = function(file) {
 if( (/image/i).test(file.type) ) {
      var reader = new FileReader();
      reader.onload = function(e) {

          var image = $('<img/>')
          .load(function() {
           var newimageurl = generateImagePair(this);
           if (newimageurl) {
              showImagesPair(file, newimageurl);
              uploadToServer(file, newimageurl.modifiedImg);
           }
      })
      .attr('src', e.target.result);
  };

  reader.readAsDataURL(file);

 } else {
  $('#uploadResult').text('Image format not supported!');
 }
}


var showImagesPair = function(file, newURL) {
 $('.originalImg').fadeOut('fast',function(){
    $(this).attr('src', newURL.originalImg).fadeIn('fast');
 });

 $('.modifiedImg').fadeOut('fast',function(){
    $(this).attr('src', newURL.modifiedImg).fadeIn('fast');
 });
}


// generates two images a) resized original b) the mosaic
// any uploaded image "normalized" to fit predefined imgWidth and imgHeight values
// smaller image centered
// larger image "scaled to fit with aspect ratio unchanged"
// white background added to both images

var generateImagePair = function(image) {

  //define canvas
  var canvas = document.createElement('canvas');
  canvas.width = imgWidth;
  canvas.height = imgHeight;
  var ctx = canvas.getContext('2d');

 var newWidth = image.width;
 var newHeight = image.height;
 var xpos = borderThickness;
 var ypos = borderThickness;

 if (image.width > imgWidth - borderThickness*2 ||
    image.height > imgHeight - borderThickness*2) {  // larger than canvas - OK

    if (image.width < image.height) {

     newWidth = ((imgHeight - borderThickness*2) /image.height)*image.width;
     newHeight = imgHeight - borderThickness*2;
     xpos = (imgWidth-newWidth-borderThickness*2)/2 + borderThickness;
    } else {

     newWidth = imgWidth - borderThickness*2;
     newHeight = ((imgWidth - borderThickness*2) /image.width)*image.height;
     ypos = (imgHeight-newHeight-borderThickness*2)/2 + borderThickness;
    }

 } else { // smaller than canvas - OK

    xpos = (imgWidth-borderThickness*2)/2 - image.width/2 + borderThickness;
    ypos = (imgHeight-borderThickness*2)/2 - image.height/2 + borderThickness;
 }

 // TODO check for images smaller than mosaicRes/mosaicRes (16x16px)
 // the following operation generates the interpolated pixels
 // without the need for getImageData and individual pixel processing
 var dbuf = document.createElement('canvas'); // double buffer as mosaic pixels data source
 dbuf.width = newWidth/mosaicRes;
 dbuf.height = newHeight/mosaicRes;
 var ctx2 = dbuf.getContext('2d');
 ctx2.drawImage(image,0,0,dbuf.width,dbuf.height);

 //clear with white background
 ctx.beginPath();
 ctx.rect(0, 0, imgWidth, imgHeight);
 ctx.fillStyle = "white";
 ctx.fill();

 ctx.imageSmoothingQuality = "high"; // image downscaling anti-alias on
 ctx.drawImage(image, xpos, ypos, newWidth, newHeight); // original image
 var originalImage = canvas.toDataURL("image/jpeg");

 //clear with white background
 ctx.beginPath();
 ctx.rect(0, 0, imgWidth, imgHeight);
 ctx.fillStyle = "white";
 ctx.fill();

 // -- renders intermed. pixlated image --
 // ctx.imageSmoothingEnabled = false;
 // ctx.drawImage(dbuf, xpos, ypos, newWidth, newHeight);  // intermediate data display

 var realWidth = dbuf.width*mosaicRes;
 var realHeight = dbuf.height*mosaicRes;

 // recalculate border offsets for the mosaic
 xpos = (imgWidth - realWidth)/2;
 ypos = (imgHeight - realHeight)/2;

 var result = renderMosaic(ctx2, // mosaic pixels
                           ctx,  // targetContext
                           dbuf.width, // mosaic xres
                           dbuf.height, // mosaic yres
                           xpos,  // border offset
                           ypos);

 var modifiedImage = canvas.toDataURL("image/jpeg");

  //return both images (original and modified) as jpeg urls
  return (!result?null:{
                        originalImg: originalImage,
                        modifiedImg: modifiedImage
          });
}



// renders centered mosaic to targetContext with pixels from sourceContext
var renderMosaic = function(sourceContext,
                            targetContext,
                            w,
                            h,
                            xoffset,
                            yoffset) {

try{
     var imgd = sourceContext.getImageData(0, 0,
                              w,
                              h);
     var pix = imgd.data;
     var cnt = 0;
     for (var i = 0, n = pix.length; i < n; i += 4) {

      targetContext.fillStyle = "rgba("+pix[i]+","+pix[i+1]+","+pix[i+2]+","+pix[i+3]+")";

      targetContext.beginPath();
      targetContext.arc((cnt % w)*mosaicRes+xoffset+mosaicRes/2,  // compute projected screen coords
                  Math.floor(cnt / w)*mosaicRes+yoffset+mosaicRes/2,
                  mosaicRes/2,
                  0,
                  2 * Math.PI);
      targetContext.fill();
      cnt++;
      }

   } catch (e) {
        $('#uploadResult').text('Image size (minimum of ' + mosaicRes+'x'+mosaicRes+'px required) or data invalid ...');
        return false;
   }

   return true;
}

// TODO move CLIENT-ID to the server and externalize
// Authorization: Client-ID YOUR_CLIENT_ID
// client-id: dcb02a546436bcd
// client-secret: c288aa67210caa21886284d50d39f1041cae6122
var uploadToServer = function(oldFile, newFile) {

// prepare FormData
var formData = new FormData();
var imgData = newFile.split(',')[1];
formData.append('image',imgData);

//submit formData using $.ajax
$.ajax({
  async: true,
  crossDomain: true,
  contentType: false,
  url: 'https://api.imgur.com/3/image',
  type: 'POST',
  headers: {
      "Authorization":"Client-ID dcb02a546436bcd"
  },
  mimeType: "multipart/form-data",
  data: formData,
  processData: false,
  success: function(data) {

    var imgurLink = JSON.parse(data).data.link;
    console.log(imgurLink);
    $('#uploadResult').text("Image uploaded ... ");

    $('<a>',{
      text: imgurLink,
      title: 'Share Image',
      href: imgurLink
    }).appendTo('#uploadResult');

  }
 });
}
