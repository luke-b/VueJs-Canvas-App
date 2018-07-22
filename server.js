var express = require('express');
var app = express();

console.log("starting server ... at: " + __dirname);

app.use(express.static(__dirname + '/'));

app.listen(process.env.PORT || 8080);
