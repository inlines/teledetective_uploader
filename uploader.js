var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var concat = require('concat-image');
var cloudinary = require('cloudinary');
fs = require('fs');

cloudinary.config({ 
  cloud_name: 'dp8fntsgn', 
  api_key: '173448469685711', 
  api_secret: 'An2wIXbiWxjhNh5OpX8ehYY00Js' 
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.route('/').post(function(req, res){
  // res.setHeader('Content-Type', 'application/json');
  var location = req.body.location
  var imgOne = location + '/green.' + req.body.green + '.png';
  var imgTwo = location + '/yellow.' + req.body.yellow + '.png';
  var imgThree = location + '/red.' + req.body.red + '.png';
  var mergedFileName = guid();
  var margin = req.body.margin ? req.body.margin : 10;

  if(!imgOne || !imgTwo || !imgThree || !location){
    res.json({error:'invalid input params'});
  }
  
  var fileContents1;
  var fileContents2;
  var fileContents3;

  try {
    fileContents1 = fs.readFileSync('./img/' + imgOne);
  } catch (err) {
    res.json({'error':'./img/' + imgOne + ' not found'});
  }
  try {
    fileContents2 = fs.readFileSync('./img/' + imgTwo);
  } catch (err) {
    res.json({'error':'./img/' + imgTwo + ' not found'});
  }

  try {
    fileContents3 = fs.readFileSync('./img/' + imgThree);
  } catch (err) {
    res.json({'error':'./img/' + imgThree + ' not found'});
  }

  var images = [];
  if(fileContents1){
    images.push(fileContents1);
  }
  if(fileContents2){
    images.push(fileContents2);
  }
  if(fileContents3){
    images.push(fileContents3);
  }

  concat({
    images: images,
    margin: margin
  }, function(err, canvas) {
    fs.writeFileSync('./img_to_upload/' + mergedFileName +'.png', canvas.toBuffer());
  });

  cloudinary.uploader.upload('./img_to_upload/' + mergedFileName +'.png', function(result) { 
    console.log(result);
    res.json({ imageLink: result.url });
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});