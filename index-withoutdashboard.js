'use strict';

// CHANGE THIS VARIABLE! //
var deviceHost = "192.168.XX.XX" // This is the IP address shown in Arduino IDE Serial Monitor after uploading Firmata

// Node modules - Don't modify
var EtherPortClient = require("etherport-client").EtherPortClient;
var Firmata = require("firmata");
var five = require("johnny-five");

// Setup - Don't modify
var board = new five.Board({
    io: new Firmata(new EtherPortClient({ host: deviceHost, port: 3030 })), timeout: 30000 });

board.on('ready', function () {
    var rightWheel = new five.Motor({ pins: [4, 12], invertPWM: true });  // Motor A: Pins 4 and 12
    var leftWheel = new five.Motor({ pins: [5, 14], invertPWM: true });  // Motor B: Pins 5 and 14
    var speed = 255;
    leftWheel.rev(0);
    rightWheel.rev(0); 

////////////////////////////////////////////////////////////////

// Write your Johnny-Five code here!
    

///////////////////////////////////////////////////////////////


    function forward() {
        leftWheel.fwd(speed);
        rightWheel.fwd(speed);
        console.log("Forward!");
    }
    function stop() {
        leftWheel.rev(0);
        rightWheel.rev(0); 
        console.log("Stop!");
    }
    function left() {
        leftWheel.rev(speed);
        rightWheel.fwd(speed);
        console.log("Left!");
    }
    function right() {
        leftWheel.fwd(speed);
        rightWheel.rev(speed);
        console.log("Right!");
    }
    function reverse() {
        leftWheel.rev(speed);
        rightWheel.rev(speed);
        console.log("Back!");
    }
    function exit() {
        setTimeout(process.exit, 1000);
    }

// This is the code for controlling car actions from the command line
    var keyMap = {
        'up': forward,
        'left': left,
        'right': right,
        'down': reverse,
        'space': stop,
        'q': exit
    };

    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("keypress", function (chunk, key) {
        if (!key || !keyMap[key.name]) return;
        actionSender();
        keyMap[key.name]();
    });
}
});
