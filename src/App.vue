<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons">
    <link rel="stylesheet" href="https://unpkg.com/vue-material@beta/dist/vue-material.min.css">
    <link rel="stylesheet" href="https://unpkg.com/vue-material@beta/dist/theme/default.css">

  <div class="md-layout">
    <div class="md-layout-item  md-xsmall-hide"></div>
    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">

        <div class="md-layout-item md-gutter">
          <img src="./assets/mosaic-logo.svg" alt="mosaic logo">
        </div>

        <div class="md-layout-item md-elevation-4 md-gutter">

                <md-field>
                  <label>Upload your photo ...</label>
                  <md-file v-model.lazy="uploadFileName"  v-on:change="signalFileChange" accept="image/*"/>
                </md-field>

                <!--
                <md-button class="md-icon-button md-dense md-raised md-primary" @click="showDialog=true;">
                  <md-icon>cached</md-icon>
                </md-button>
              -->

       </div>

       <div class="gallery-label md-layout-item md-gutter md-alignment-center-center">
          <label>OR select from a photo gallery ... </label>
        </div>

       <div class="gallery-container" >
         <md-button class="md-primary" @click="openGallery(galleryConfig.imgur.url,galleryConfig.imgur.auth)">Imgur</md-button>
         <md-button class="md-primary" @click="galleryURLtoArray(galleryConfig.reddit1.url,galleryConfig.reddit1.auth)" :disabled="true">Reddit 1</md-button>
         <md-button class="md-primary" @click="galleryURLtoArray(galleryConfig.reddit2.url,galleryConfig.reddit2.auth)" :disabled="true">Reddit 2</md-button>
       </div>

       <div class="gallery-container" >


         <md-card class="md-layout-nowrap"
                  md-with-hover
                  v-for="cardIndex in 8"
                  :key="cardIndex">
              <div class="md-card-wrapper" @click="galleryItemClicked(cardIndex-1)">
                <template v-if="cardIndex < 8">
                   <transition name="component-fade" mode="out-in" > <!-- smooth transition from spinner to image -->
                      <template v-if="cardImages[cardIndex-1].src"> <!-- when image data is present -->
                          <img :src="cardImages[cardIndex-1].src"
                               :key="cardImages[cardIndex-1].src"
                               :alt="'card'+cardIndex">
                      </template>
                      <template v-else>
                         <div class="card-spinner"> <!-- when src is '' then a spinner is shown -->
                           <md-progress-spinner :md-diameter="15" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
                         </div>
                      </template>
                   </transition>
                </template>
                <template v-else>
                  <md-card-actions>
                    <md-button class="md-icon-button">
                     <md-icon>navigate_next</md-icon>
                   </md-button>
                  </md-card-actions>
                </template>
              </div>
         </md-card>

       </div>

    </div>
    <div class="md-layout-item  md-xsmall-hide"></div>
  </div>


  <!-- lightbox -->

  <md-dialog :md-active.sync="showDialog">
   <md-dialog-title>Preview <template v-if="uploadFileName">({{uploadFileName}})</template></md-dialog-title>

   <md-tabs md-dynamic-height>

   <md-tab md-label="Mosaic" style="text-align:center;">
     <img :src="mosaicImage"  style="widht:300px;height:300px;"/>
   </md-tab>

     <md-tab md-label="Original" style="text-align:center;">
       <img :src="originalImage"  style="widht:300px;height:300px;"/>
     </md-tab>

   </md-tabs>

     <div style="padding-left:20px;padding-top:15px;">{{ imageLoadMessage }}
          <span v-if="imgurUrl"><md-icon>arrow_right_alt</md-icon></span>
          <b v-if="imgurUrl">{{imgurUrl}}</b>
     </div>


   <md-dialog-actions>
     <md-button v-if="imgurUrl" class="md-raised md-primary" @click="openImgurInNewTab">Open Imgur</md-button>
     <md-button class="md-raised md-primary" @click="uploadToServer" :disabled="imageUploaded">Share</md-button>
     <md-button class="md-primary" @click="showDialog = false; uploadFileName ='';">Close</md-button>
   </md-dialog-actions>
 </md-dialog>



  </div>
</template>

<script>


var config = {
  imgWidth : 500,  // mosaic image max width in px
  imgHeight : 500,
  mosaicRes : 16, // mosaic cell size in px
  borderThickness : 10,  // mosaic image border thickness in px
}

export default {
  name: 'app',
  mounted: function () {
      console.log("mounted() ***");
      this.openGallery(this.galleryConfig.imgur.url,
                       this.galleryConfig.imgur.auth);
  },
  data () {
    return {
      showDialog: false,
      uploadFileName : '',
      imageLoadMessage: '',
      mosaicImage: './assets/blank.jpg',
      originalImage: './assets/blank.jpg',
      mosaicData: '',
      imageUploaded: true,
      imgurUrl: '',
      galleryIndex: 0,
      galleryOffset: 0,
      galleryImagesLinks: [],
      thumbCache: [],
      testThumb: "./assets/blank.jpg",
      galleryConfig: {
                      reddit1: {
                          url: "https://www.reddit.com/r/EarthPorn/comments.json",
                          auth: false
                      },
                      reddit2: {
                          url: "https://www.reddit.com/r/aww/comments.json",
                          auth: false
                      },
                      imgur: {
                          url: "https://api.imgur.com/3/gallery/search/time/5/0?q=earth",
                          auth: true
                      },
      },
      cardImages: [ // gallery data
          { src: '', originalSize: '' },
          { src: '', originalSize: '' },
          { src: '', originalSize: '' },
          { src: '', originalSize: '' },
          { src: '', originalSize: '' },
          { src: '', originalSize: '' },
          { src: '', originalSize: '' },
          { src: '', originalSize: '' },
          { src: '', originalSize: '' }
      ]
    }
  },
  methods:{

     openGallery: function(galleryURL,isAuthorized) {
          var c = this;
          this.clearGallery();

          this.galleryURLtoArray(galleryURL,isAuthorized).then((imageLinks) => {
              console.log("openGallery / imageLinks = " + imageLinks);
              c.galleryImagesLinks = imageLinks;
              c.galleryOffset = 0;
              c.galleryArrayToScreen(  c.galleryImagesLinks ,c.galleryOffset);
          }).catch((error) => {
              console.log("openGallery / error = " + error);
          });
     },

     clearGallery: function() {
         for (var i = 0; i < this.cardImages.length-1; i++) {  // show spinners
             this.cardImages[i].src = '';
         }
     },

     galleryItemClicked : function(clickedIndex) { // thumbnail slider click handler

        if (clickedIndex == 7) {  // next page clicked
            var imgsReady = true;
            for (var i = 0; i < this.cardImages.length-1; i++) {
                if (this.cardImages[i].src == '') {
                    imgsReady = false;
                    break;
                }
            }
            if (imgsReady) {
                this.clearGallery();
                // handle next page
                this.galleryOffset = this.galleryArrayToScreen(
                                          this.galleryImagesLinks,
                                          this.galleryOffset+7);

                console.log("--> handle next page");
            } else {
                console.log("--> ignore next page");
            }
        } else {  // image clicked
          if (this.cardImages[clickedIndex].src != '') { // is image loaded?
              // handle image clicked
              console.log("--> handle image clicked");

              this.showDialog = true;
              this.imageLoaded(this.cardImages[clickedIndex].originalSize);
          }
        }

     },

     loadImage: function(file) {

                this.imgurUrl = '';
                this.imageLoadMessage = "Image beeing loaded ...";

                var li = this;
                if( (/image/i).test(file.type) ) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var img = new Image();
            				img.src = e.target.result; // loaded image
             				img.addEventListener("load",function(){
                      li.imageLoaded(this); //img
                    });
                }
              reader.readAsDataURL(file);

              } else {
                 this.imageLoadMessage = "Invalid file format";
              }


     },
     imageLoaded: function(img) {

          this.imageLoadMessage = 'Image loaded.';
          var newimageurl = this.generateImagePair(img);
          if (newimageurl) {
            this.imageLoadMessage = 'Click Share to upload mosaic to Imgur.';
                this.imgurUrl = '';

            this.imageUploaded = false;

            this.originalImage = newimageurl.originalImg;
            this.mosaicImage = newimageurl.modifiedImg;

            this.mosaicData = newimageurl.modifiedImg;

            this.$forceUpdate();

          //  this.uploadToServer(file, newimageurl.modifiedImg);
        	} else {
            this.imageLoadMessage = 'Error creating mosaic. Please re-try.';
          }
     },

     // reddit 1: https://www.reddit.com/r/EarthPorn/comments.json
     // path: data.children[].data.link_url
     // auth: -

     // reddit 2: https://www.reddit.com/r/aww/comments.json
     // path: data.children[].data.link_url
     // auth: -

     // imgur gallery search: https://api.imgur.com/3/gallery/search/time/{{5}}/{{0}}?q=elon musk
     // path?: data[].images[0].link
     // auth: CLIENT_ID

     // loads and transforms a json to an array with image urls
     galleryURLtoArray: function(galleryURL,isAuthorized) {

          return new Promise( (resolve, reject) => {

           this.$http.get(galleryURL,(isAuthorized?{
            headers: {
                        'Authorization':'Client-ID dcb02a546436bcd'
                      }}:{})
           ).then((response) => {

                var imageLinks = [];
                if (isAuthorized) { // TODO remove - true = imgur

                    for (var i = 0; i < response.data.data.length; i++) {
                        if (response.data.data[i].images) {
                          var fileName = response.data.data[i].images[0].link;
                          if ((fileName.endsWith('gif') || fileName.endsWith('png') ||
                              fileName.endsWith('jpg'))) {
                              imageLinks.push(fileName);
                          }
                        }
                    }
                } else { // false = reddit

                    for (var i = 0; i < response.data.data.children.length; i++) {
                        var fileName = response.data.data.children[i].data.link_url;
                        if (fileName.startsWith('https://i.imgur.com/') ||
                            fileName.startsWith('https://i.redd.it/') &&
                            (fileName.endsWith('gif') || fileName.endsWith('png') ||
                             fileName.endsWith('jpg'))) {
                            imageLinks.push(fileName);
                        }
                    }
                }

                resolve(imageLinks);
           },(error) => {

                reject(new Error('gallery load error ',error));
           });
           });
     },

     // displays one page of the given gallery array to screen
     galleryArrayToScreen: function(galleryArray,pageOffset) {

          //imageURLtoThumbnail(imageURL)
          var c = this;

          var realOffset = pageOffset;
          if (realOffset + 7 >= galleryArray.length) {
             realOffset = galleryArray.length - 7;
          }

          for (var i = 0; i < 8; i++) {
              var index = pageOffset + i;
              if (index < galleryArray.length) {

                  this.imageURLtoThumbnail(galleryArray[index],i).then(
                                          function(data) {
                      c.cardImages[data.cIndex].src = data.thumbData;
                      c.cardImages[data.cIndex].originalSize = data.originalSize;

                      console.log('%c       ', 'font-size:60px;background: url('+data.thumbData+') no-repeat;');
                      console.log('cIndex = ' + data.cIndex);
                  });
              }
          }

          return realOffset;
     },



     // loads and transforms an arbitrary image to a thumbnail images
     // should handle caching
     imageURLtoThumbnail: function(imageURL,cIndex) {

          var c = this;

          return new Promise( function(resolve, reject) {

      //   if (c.thumbCache[imageURL]) {
      //      resolve(c.thumbCache[imageURL]);
      //    }

          var canvas = document.createElement('canvas');
          canvas.width = 60;
          canvas.height = 60;

          var ctx = canvas.getContext("2d");
          var img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = imageURL;


          img.onload = function() {

            ctx.beginPath();
            ctx.rect(0, 0, 60, 60);
            ctx.fillStyle = "white";
            ctx.fill();

            ctx.imageSmoothingQuality = "high";

            if(img.width > img.height) {
              var r = (img.height/img.width)*60;
              ctx.drawImage(img, 0, 30-r/2, 60, r);
            } else {
              var r = (img.width/img.height)*60;
              ctx.drawImage(img, 30-r/2, 0, r, 60);
            }

            var dataURL = canvas.toDataURL();
            c.thumbCache[imageURL] = dataURL;

            resolve({thumbData:dataURL,
                     originalSize:img,
                     cIndex:cIndex});
          };

          });

     },

     uploadToServer: function() {

         this.imgurUrl = '';
         this.imageUploaded = true;
         this.imageLoadMessage = 'Uploading to Imgur ...';
         var data = new FormData()
         data.set('image', this.mosaicData.split(',')[1]); //just the base64 image part

         this.$http.post('https://api.imgur.com/3/image', data, {
          headers: {
                      'Authorization':'Client-ID dcb02a546436bcd'
                    }
         }).then((response) => {

             var link = response.data.data.link;
             this.imgurUrl = link;
             this.imageLoadMessage = 'Mosaic image ready for sharing';
             this.imageUploaded = true;
            // console.log(response);
         },(error) => {

             this.imageUploaded = false;
             this.imageLoadMessage = 'Unable to upload image. Please re-try.';
          //   console.log('upload error',error);
         });

     },

     // generates two images a) resized original b) the mosaic
     // any uploaded image "normalized" to fit predefined imgWidth and imgHeight values
     // smaller image centered
     // larger image "scaled to fit with aspect ratio unchanged"
     // white background added to both images

     generateImagePair : function(image) {

       //define canvas
       var canvas = document.createElement('canvas');
       canvas.width = config.imgWidth;
       canvas.height = config.imgHeight;
       var ctx = canvas.getContext('2d');

      var newWidth = image.width;
      var newHeight = image.height;
      var xpos = config.borderThickness;
      var ypos = config.borderThickness;

      if (image.width > config.imgWidth - config.borderThickness*2 ||
         image.height > config.imgHeight - config.borderThickness*2) {  // larger than canvas - OK

         if (image.width < image.height) {

          newWidth = ((config.imgHeight - config.borderThickness*2) /image.height)*image.width;
          newHeight = config.imgHeight - config.borderThickness*2;
          xpos = (config.imgWidth-newWidth-config.borderThickness*2)/2 + config.borderThickness;
         } else {

          newWidth = config.imgWidth - config.borderThickness*2;
          newHeight = ((config.imgWidth - config.borderThickness*2) /image.width)*image.height;
          ypos = (config.imgHeight-newHeight-config.borderThickness*2)/2 + config.borderThickness;
         }

      } else { // smaller than canvas - OK

         xpos = (config.imgWidth-config.borderThickness*2)/2 - image.width/2 + config.borderThickness;
         ypos = (config.imgHeight-config.borderThickness*2)/2 - image.height/2 + config.borderThickness;
      }

      // images smaller than mosaicRes/mosaicRes (16x16px) will cause an error
      // the following operation generates the interpolated pixels
      // without the need for getImageData and individual pixel processing
      var dbuf = document.createElement('canvas'); // double buffer as mosaic pixels data source
      dbuf.width = newWidth/config.mosaicRes;
      dbuf.height = newHeight/config.mosaicRes;
      var ctx2 = dbuf.getContext('2d');
      ctx2.drawImage(image,0,0,dbuf.width,dbuf.height);

      //clear with white background
      ctx.beginPath();
      ctx.rect(0, 0, config.imgWidth, config.imgHeight);
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.imageSmoothingQuality = "high"; // image downscaling anti-alias on
      ctx.drawImage(image, xpos, ypos, newWidth, newHeight); // original image
      var originalImage = canvas.toDataURL("image/jpeg");

      //clear with white background
      ctx.beginPath();
      ctx.rect(0, 0, config.imgWidth, config.imgHeight);
      ctx.fillStyle = "white";
      ctx.fill();

      // -- renders intermed. pixlated image --
      // ctx.imageSmoothingEnabled = false;
      // ctx.drawImage(dbuf, xpos, ypos, newWidth, newHeight);  // intermediate data display

      var realWidth = dbuf.width*config.mosaicRes;
      var realHeight = dbuf.height*config.mosaicRes;

      // recalculate border offsets for the mosaic
      xpos = (config.imgWidth - realWidth)/2;
      ypos = (config.imgHeight - realHeight)/2;

      var result = this.renderMosaic(ctx2, // mosaic pixels
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
     },

     renderMosaic : function(sourceContext,
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
               targetContext.arc((cnt % w)*config.mosaicRes+xoffset+config.mosaicRes/2,  // compute projected screen coords
                           Math.floor(cnt / w)*config.mosaicRes+yoffset+config.mosaicRes/2,
                           config.mosaicRes/2,
                           0,
                           2 * Math.PI);
               targetContext.fill();
               cnt++;
           }

        } catch (e) {
               this.imageLoadMessage = 'Image size (minimum of ' + config.mosaicRes+'x'+config.mosaicRes+'px required) or data invalid ...';
               return false;
        }

        return true;
     },

     signalFileChange: function(evt){
                    //  console.log(config.imgWidth);
                      this.loadImage(evt.target.files[0]);
                      this.showDialog = true;
                   },

      openImgurInNewTab: function() {
        window.open(this.imgurUrl, '_blank');
      }

  }
}
</script>

<!-- slicker layout: https://codesandbox.io/s/github/vuematerial/examples/tree/master/examples/login -->

<style lang="scss">
  .md-card {
    padding:10px;
    display: inline-block;

  }

  .md-card-wrapper {
    width:60px;
    height:60px;
  }

  .md-layout-item {
    padding:5px;
    margin:25px;
   }
   .md-elevation-6 {
     padding-left:15px;
     padding-right:15px;
   }
   .gallery-label {
     text-align:center;
   }
   .gallery-container {
     text-align:center;
   }

   .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
   }

   .card-spinner {
      text-align:center;
      position:relative;
      top:50%;
      transform: translateY(-50%);
   }

  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
   opacity: 0;
   }

</style>
