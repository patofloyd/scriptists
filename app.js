var express = require('express');
var app = express();
var bodyparser = require('body-parser')
var mongoose = require("mongoose");
var Detection = require(__dirname+"/models/detection.js")
var five = require("johnny-five");
var board = new five.Board();
var count = 0;
var request = require('request');
var alarmIntervalMemory;

var detectedObject = {};

app.use(express.static(__dirname+ '/www'));
app.use(bodyparser.urlencoded({extended:true}))
mongoose.connect('mongodb://127.0.0.1/scriptists');
mongoose.connection.once('open', () => {
  console.log("Mongoose connected to Scriptists");    
  return
});

app.get('/', function(req, res){
  res.send('Please use /detection!');
});



//Get detection by id
app.get('/detection/:_id', function(req, res){
  Detection.getDetectionById(req.params._id, function(err, detection){
    if(err){
      throw err;
    }
    res.json(detection);
  });
});



app.post('/detection', function (req, res) {  
  var enDetection = new Detection(req.body);
  //console.log("antaligen sparad i databas");
  res.json(req.body)
  
});

app.get('/detection', function (req, res) {  
  Detection.find(function(err, result){
    if(err) {console.log(err)}
    res.json(result)
  })

});

app.get('/shutDown', function (req, res) {  
  clearInterval(alarmIntervalMemory);
  res.end();

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

    // Don't do anything if we are already waiting for user input/alarm
    if(motionTimeoutMemory){ return; }

    console.log("Motion Detected, Please sign in");

    detectedObject.date =  new Date().toISOString().slice(0,10).replace(/-/g,"-");


    me.repl.inject({
      led: led
    });

    led.on();

    motionTimeoutMemory = setTimeout(soundAlarm, 10000);

  });

  function soundAlarm(){
    motionTimeoutMemory = false;
    console.log("ALARM STARTING");
    var piezo = new five.Piezo(5);

    board.repl.inject({
      piezo: piezo
    });

    var song = [["C4", 1 / 4], ["D4", 1 / 4]];

    clearInterval(alarmIntervalMemory);
    alarmIntervalMemory = setInterval(function(){
       piezo.play({
        song: song,
        tempo: 100
      });
    },400);
   
    
    detectedObject.hasLoggedIn = false;
    detectedObject.userId = "INTRUDER"


    var enDetection = new Detection(detectedObject);
    enDetection.save(function(error){
      console.log(error);
    });
    
  }


  var buttonTimeoutMemory;

  button.on("up", function() {

    // No motion previously detected ignore button press
    if(!motionTimeoutMemory){ return; }
    
    count += 1;
    console.log("CLICKED");
    clearTimeout(buttonTimeoutMemory);
    buttonTimeoutMemory = setTimeout(doneClicking, 1000);

  });


  function doneClicking(){

    detectedObject.userId = count;
    var countResult = count;
    count = 0;
    console.log("Welcome User", countResult);
    detectedObject.hasLoggedIn = true;
      led.off();

    var userFound = true;
    
    if(userFound == true){
      console.log("NO ALARM...");
      clearInterval(alarmIntervalMemory);
      clearTimeout(motionTimeoutMemory);
      motionTimeoutMemory = false;
    }

    console.log(detectedObject)
    var enDetection = new Detection(detectedObject);
    enDetection.save(function(error){
      console.log(error);
    });
    

   
  } 


});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server running on port: " +port);

});