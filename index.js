'use strict';

// CHANGE THESE THREE VARIABLES! //
var deviceHost = "192.168.XX.XX" // This is the IP address shown in Arduino IDE Serial Monitor after uploading Firmata
var deviceID = 'my_bot_XXXXXXXX'; // This is the deviceID you entered in iothub-explorer
var deviceKey = 'XXXXXXXXXXXXXXXXXXXXXX'; // This is the primary key returned by iothub-explorer

// Node modules - Don't modify
var moment = require('moment');
var EtherPortClient = require("etherport-client").EtherPortClient;
var Firmata = require("firmata");
var five = require("johnny-five");
var Protocol = require('azure-iot-device-amqp').Amqp;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

// Setup - Don't modify
var board = new five.Board({
    io: new Firmata(new EtherPortClient({ host: deviceHost, port: 3030 })), timeout: 30000 });
var connectionString = 'HostName=huzzahbots.azure-devices.net;DeviceId=' + deviceID + ';SharedAccessKey=' + deviceKey + '';
var client = Client.fromConnectionString(connectionString, Protocol);
var currentaction = "offline";
board.on('ready', function () {
    letsPlay();
    var connectCallback = function (err) {
        if (err) { console.error('Your device is not connected to the web dashboard. Could not connect: ' + err.message); } 
        else {
            console.log('Client connected');
            client.on('message', function (msg) {
                currentaction = "home";
                console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
                client.complete(msg, printResultFor('completed'));
            });
            client.on('error', function (err) {
                currentaction = "offline";
                console.error(err.message);
            });
            client.on('disconnect', function () {
                currentaction = "offline";
                client.removeAllListeners();
                client.open(connectCallback);
            });
        }
    };
    client.open(connectCallback);
});
    function printResultFor(op) {
        return function printResult(err, res) {
            if (err) console.log(op + ' error: ' + err.toString());
            if (res) console.log(op + ' status: ' + res.constructor.name);
        };
    }
function letsPlay(){
    var rightWheel = new five.Motor({ pins: [4, 12], invertPWM: false });
    var leftWheel = new five.Motor({ pins: [5, 14], invertPWM: false });
    var scalar = 1280; // Friction coefficient
    var actioncounter = 0;
    var newcommand = "clear()";

// Write your Johnny-Five code here
    
    var speed = 0;
    stop();
    
///////////////////////////////////
   
    function actionSender(){
        var distance = 0;
        Math.round(actioncounter);
        if (currentaction == "fd" || currentaction == "bk") {
            var a = (moment.now() - actioncounter) * 0.18 * speed / scalar;
            newcommand = "" + currentaction +"(" + a + ")";
            distance = a;
        }
        else if (currentaction == "rt" || currentaction == "lt") {
            var a = (moment.now() - actioncounter) * 0.1 * speed / scalar;
            newcommand = "" + currentaction +"(" + a + ")";
            distance = 0;
        }
        else if (currentaction == "home") {
            newcommand = "clear()";
            distance = 0;
        }
        else { newcommand = "fd(0)"; };
        var data = JSON.stringify({ deviceId: deviceID, command: newcommand, distance: distance });
        var message = new Message(data);
        console.log('Sending message: ' + message.getData());
        client.sendEvent(message, printResultFor('send'));
        actioncounter = moment.now();
    }

    function reverse() { // Doesn't work, car just stops.
        leftWheel.rev(speed); 
        rightWheel.rev(speed);
        currentaction = "bk";
        console.log("Back it up...");
    }
    function forward() {
        leftWheel.fwd(speed);
        rightWheel.fwd(speed);
        currentaction = "fd";
        console.log("Forward!");
    }
    function stop() {
        leftWheel.rev(0); // This makes the car stop.
        rightWheel.rev(0); 
        currentaction = "stopped";
        console.log("STAHP");
    }
    function left() {
        leftWheel.rev(speed);
        rightWheel.fwd(speed);
        currentaction = "lt";
        console.log("To the left...");
    }
    function right() {
        leftWheel.fwd(speed);
        rightWheel.rev(speed);
        currentaction = "rt";
        console.log("To the right...");
    }
    function exit() {
        currentaction = "offline";
        setTimeout(process.exit, 1000);
    }

    var keyMap = {
        'up': forward,
        'down': reverse,
        'left': left,
        'right': right,
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
