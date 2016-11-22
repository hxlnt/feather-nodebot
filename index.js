var EtherPortClient = require("etherport-client").EtherPortClient;
var Firmata = require("johnny-five/node_modules/firmata");
var five = require("johnny-five");

var board = new five.Board({
    io: new Firmata(new EtherPortClient({
        host: "192.168.1.4",
        port: 3030
    })),
    timeout: 30000
});

board.on('ready', function () {
    console.log("It's Johnny-Five time!");
    var led = new five.Led(0);
    led.pulse();
});