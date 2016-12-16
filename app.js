var express = require('express');
var app = express();
var bodyparser = require('body-parser')
var mongoose = require("mongoose");
var Detection = require(__dirname+"/models/detection.js")
var five = require("johnny-five");
var board = new five.Board();
var count = 0;
var request = require('request');

var detectedObject = {};


app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}))
mongoose.connect('mongodb://127.0.0.1/scriptists');
mongoose.connection.once('open', () => {
  console.log("Mongoose connected to Scriptists");    
  return
});



app.post('/detection', function (req, res) {  
  console.log(req)
  var enDetection = new Detection(req.body);
  console.log("antaligen sparad i databas");
  res.json(req.body)
  
});

app.get('/detection', function (req, res) {  
  Detection.find(function(err, result){
    if(err) {console.log(err)}
    res.json(result)
  })
});

  board.on("ready", function() {
    var motion = new five.Motion(7);
    var button = new five.Button(3);
    var led = new five.Led(13);
    
    board.repl.inject({
      button: button
    });

    motion.on("calibrated", function() {
      console.log("Welcome, please sign in");
    });

    var motionTimeoutMemory;
    var me = this;
    motion.on("motionstart", function() {

      console.log("Motion Detected, Please sign in");

      detectedObject.date = Date.now();

    me.repl.inject({
      led: led
    });

    led.on();
      motionTimeoutMemory = setTimeout(soundAlarm, 5000);

    });

    function soundAlarm(){
      var piezo = new five.Piezo(5);
      detectedObject.hasLoggedIn = false;
    board.repl.inject({
      piezo: piezo
    });

    piezo.play({

      song: [
        ["C4", 1 / 4],
        ["D4", 1 / 4],
        ["F4", 1 / 4],
        ["D4", 1 / 4],
        ["A4", 1 / 4],
        [null, 1 / 4],
        ["A4", 1],
        ["G4", 1],
        [null, 1 / 2],
        ["C4", 1 / 4],
        ["D4", 1 / 4],
        ["F4", 1 / 4],
        ["D4", 1 / 4],
        ["G4", 1 / 4],
        [null, 1 / 4],
        ["G4", 1],
        ["F4", 1],
        [null, 1 / 2]
      ],
      tempo: 100
    });

    piezo.play({
      song: "C D F D A - A A A A G G G G - - C D F D G - G G G G F F F F - -",
      beats: 1 / 4,
      tempo: 100
    });
    }

    var buttonTimeoutMemory;

    button.on("up", function() {
      
      count += 1;

      clearTimeout(buttonTimeoutMemory);
      buttonTimeoutMemory = setTimeout(doneClicking, 1000);

    });

    function doneClicking(){

      detectedObject.userId = count;
      console.log(typeof(count))
      var countResult = count;
      count = 0;
      console.log("Welcome User", countResult);
      detectedObject.hasLoggedIn = true;
        led.off();

      var userFound = true;
      if(userFound){
         clearTimeout(motionTimeoutMemory);
      }    
      console.log(detectedObject)
      var enDetection = new Detection(detectedObject)
     
    } 



  });

var port = process.env.PORT || 3000;
app.listen(port, function() {
 console.log("Server running on port: " +port)
 });