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

         <md-button class="md-primary" @click="showDialog=true">Imgur</md-button>
         <md-button class="md-primary">Redit 1</md-button>
         <md-button class="md-primary">Redit 2</md-button>
       </div>

        <div class="gallery-container" >

         <md-card class="md-layout-nowrap" md-with-hover>
            <img src="./assets/thumb1.png" alt="thumb60x60px">
         </md-card>

         <md-card class="md-layout-nowrap" md-with-hover>
            <img src="./assets/thumb1.png" alt="thumb60x60px">
         </md-card>

         <md-card class="md-layout-nowrap" md-with-hover>
            <img src="./assets/thumb1.png" alt="thumb60x60px">
         </md-card>

         <md-card class="md-layout-nowrap" md-with-hover>
            <img src="./assets/thumb1.png" alt="thumb60x60px">
         </md-card>

       </div>
         <div class="gallery-container" >


         <md-card class="md-layout-nowrap" md-with-hover>
            <img src="./assets/thumb1.png" alt="thumb60x60px">
         </md-card>

         <md-card class="md-layout-nowrap" md-with-hover>
            <img src="./assets/thumb1.png" alt="thumb60x60px">
         </md-card>

         <md-card class="md-layout-nowrap" md-with-hover>
            <img src="./assets/thumb1.png" alt="thumb60x60px">
         </md-card>

         <md-card class="md-layout-nowrap" md-with-hover>
           <md-card-actions>
             <md-button class="md-icon-button">
              <md-icon>navigate_next</md-icon>
            </md-button>
          </md-card-actions>

         </md-card>
       </div>

    </div>
    <div class="md-layout-item  md-xsmall-hide"></div>
  </div>


  <!-- lighbox -->

  <md-dialog :md-active.sync="showDialog">
   <md-dialog-title>Preview ({{uploadFileName}})</md-dialog-title>

   <md-tabs md-dynamic-height>

   <md-tab md-label="Mosaic" style="text-align:center;">
     <img :src="mosaicImage"  style="widht:300px;height:300px;"/>
   </md-tab>

     <md-tab md-label="Original" style="text-align:center;">
       <img :src="originalImage"  style="widht:300px;height:300px;"/>
     </md-tab>



   </md-tabs>

     <div style="padding-left:20px;padding-top:15px;">{{ imageLoadMessage }}<a v-bind:href="imgurUrl">{{imgurUrl}}</a></div>


   <md-dialog-actions>

     <md-button class="md-primary" @click="uploadToServer" :disabled="imageUploaded">Upload</md-button>
     <md-button class="md-primary" @click="showDialog = false">Close</md-button>
   </md-dialog-actions>
 </md-dialog>



  </div>
</template>

<script>

var config = {
  imgWidth : 500,  // image max width in px
  imgHeight : 500,
  mosaicRes : 16, // px
  borderThickness : 10,  // image border thickness in px
}

export default {
  name: 'app',
  created: function () {
    console.log('Mosaic effect param: ' + config.imgWidth);
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
      imgurUrl: ''
    }
  },
  methods:{
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
            this.imageLoadMessage = 'Mosaic generated. Click Upload to upload mosaic to Imgur.';

            this.imageUploaded = false;

            this.originalImage = newimageurl.originalImg;
            this.mosaicImage = newimageurl.modifiedImg;

            this.mosaicData = newimageurl.modifiedImg;

            this.$forceUpdate();

          //  this.uploadToServer(file, newimageurl.modifiedImg);
        	} else {
            this.imageLoadMessage = 'Error creating mosaic';
          }
     },

     uploadToServer: function() {

        this.imgurUrl = '';
        this.imageUploaded = true;
         this.imageLoadMessage = 'Uploading to Imgur ...';
         var data = new FormData()
         data.set('image', this.mosaicData.split(',')[1])
         this.$http.post('https://api.imgur.com/3/image', data, {
          headers: {
                      'Authorization':'Client-ID dcb02a546436bcd'
                    }
         }).then((response) => {

             var link = response.data.data.link;
             this.imgurUrl = link;
             this.imageLoadMessage = 'Image ready for sharing:';
             this.imageUploaded = true;
             console.log(response);
         },(error) => {
         this.imageUploaded = false;
             this.imageLoadMessage = 'Unable to upload image.';
             console.log('upload error',error);
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

      // TODO check for images smaller than mosaicRes/mosaicRes (16x16px)
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
                      console.log(config.imgWidth);

                      this.loadImage(evt.target.files[0]);

                        this.showDialog = true;
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
</style>
