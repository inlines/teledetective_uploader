var express = require('express');
var app = express();
bodyParser = require('body-parser');
var concat = require('concat-image');
var cloudinary = require('cloudinary');
fs = require('fs');

cloudinary.config({ 
  cloud_name: 'dp8fntsgn', 
  api_key: '173448469685711', 
  api_secret: 'An2wIXbiWxjhNh5OpX8ehYY00Js' 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/').post(function(req, res){
  res.setHeader('Content-Type', 'application/json');
  var imgOne = req.body.imgOne;
  var imgTwo = req.body.imgTwo;
  var imgThree = req.body.imgThree;
  var mergedFileName = req.body.merged_filename;
  var margin = req.body.margin ? req.body.margin : 10;
  if(!imgOne || !imgTwo || !imgThree || !mergedFileName){
    res.send(JSON.stringify({'error':'invalid input params'}));
  }
  
  var fileContents1;
  var fileContents2;
  var fileContents3;
  try {
    fileContents1 = fs.readFileSync('./img/' + imgOne);
  } catch (err) {
    res.send(JSON.stringify({'error':'./img/' + imgOne + ' not found'}));
  }
  try {
    fileContents2 = fs.readFileSync('./img/' + imgTwo);
  } catch (err) {
    res.send(JSON.stringify({'error':'./img/' + imgTwo + ' not found'}));
  }

  try {
    fileContents3 = fs.readFileSync('./img/' + imgThree);
  } catch (err) {
    console.log('./img/' + imgThree + ' not found');
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
    res.send(JSON.stringify({ imageLink: result.url }));
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});