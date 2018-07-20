# mosaic-test [![Build Status](https://travis-ci.org/luke-b/mosaic-test.svg?branch=master)](https://travis-ci.org/luke-b/mosaic-test)[![Heroku](http://heroku-badge.herokuapp.com/?app=mosaic-test&style=flat&svg=1)](https://mosaic-test.herokuapp.com/)

> Image manipulation SPA 

(1)<br />
Development started with a simple quick proof-of-concept prototype focused
on core image-related routines without any additional features and UI. 
The solution was a simple page with vanilla JS and some JQuery.<br />
<br />
Prototype's core features:<br />
a) upload and image resizing to fit predefined maximum size<br />
b) mosaic effect generation<br />
c) mosaic upload to Imgur<br />

http://localhost:8080/image-lab.html<br />
or<br />
http://mosaic-test.herokuapp.com/image-lab.html<br />

(2)<br />
Today I designed the UI using material components from 'vue material'. The user flow
is simple. The entry screen contains an file upload input and a gallery to pick 
images from. When the image is selected and uploaded a 'light-box' window pops up with
the original and the processed mosaic image.<br />
<br />
![Entry screen](https://raw.githubusercontent.com/luke-b/mosaic-test/master/ui-layout1.png)
![Mosaic preview lightbox](https://raw.githubusercontent.com/luke-b/mosaic-test/master/ui-layout2.png)
<br />
(3)<br />
Today the Vue app was created. Completed features are: upload, mosaic creation and imgur upload.<br />
<br />
(4)<br />
Today the gallery has been added and some async parts have been changed to es6 promises. <br />
![Gallery screenshot](https://github.com/luke-b/mosaic-test/blob/master/ui-shot1.png)<br/>
<br/>
(5)<br />
Today the Gallery has been finished. Travis CI has been connected along with Heroku and<br/>
Selenium e2e/regression testing via Ghostinspector. Github readme contains "badges" with<br/>
live build status info (next to the title) Every time code is pushed to master<br/>
test,build and deploy are triggered.<br/>
The selenium test contains the whole user path:<br/>
[click for selenium test script details](http://htmlpreview.github.io/?https://github.com/luke-b/mosaic-test/blob/master/user%20path%20with%20upload%20and%20assertions.html)<br/>
Heroku live version:<br/>
http://mosaic-test.herokuapp.com<br/>
<br/>
Next steps:<br />
a) tests<br />
b) refactoring and cleanup<br/>
c) docs<br/>
<br/>

(the code is leaking CLIENT-ID)




## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
