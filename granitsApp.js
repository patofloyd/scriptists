var five = require("johnny-five");
var board = new five.Board();
var count = 0;

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

  // This will grant access to the led instance
  // from within the REPL that's created when
  // running this program.
  me.repl.inject({
    led: led
  });

  led.on();
    motionTimeoutMemory = setTimeout(soundAlarm, 1000);

  });


  function soundAlarm(){
    var piezo = new five.Piezo(5);

  // Injects the piezo into the repl
  board.repl.inject({
    piezo: piezo
  });

  // Plays a song
  piezo.play({
    // song is composed by an array of pairs of notes and beats
    // The first argument is the note (null means "no note")
    // The second argument is the length of time (beat) of the note (or non-note)
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

  // Plays the same song with a string representation
  piezo.play({
    // song is composed by a string of notes
    // a default beat is set, and the default octave is used
    // any invalid note is read as "no note"
    song: "C D F D A - A A A A G G G G - - C D F D G - G G G G F F F F - -",
    beats: 1 / 4,
    tempo: 100
  });
  }

  /* motion.on("motionend", function() {
    console.log("Welcome, please sign in");
  }); */


  var buttonTimeoutMemory;

  button.on("up", function() {
    
    count += 1;

    clearTimeout(buttonTimeoutMemory);
    buttonTimeoutMemory = setTimeout(doneClicking, 1000);

  });

  function doneClicking(){

    var countResult = count;
    count = 0;
    console.log("Welcome User", countResult);
      led.off();

    // Look in database if mathc for numberofclicks
    var userFound = true;
    if(userFound){
       clearTimeout(motionTimeoutMemory);
    }    
  } 



});



