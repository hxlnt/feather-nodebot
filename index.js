var EtherPortClient = require("etherport-client").EtherPortClient;
var Firmata = require("johnny-five/node_modules/firmata");
var five = require("johnny-five");

var board = new five.Board({
    io: new Firmata(new EtherPortClient({
        host: "192.168.1.2",
        port: 3030
    })),
    timeout: 30000
});

board.on('ready', function () {
    console.log("It's Johnny-Five time!");

    // Connect long leg of LED to pin 0. Connect short leg to GND
    var led = new five.Led(0);
    led.blink(500);

    // Connect motor pins from H-bridge to 2, 12, 13, and 16 as indicated.
    // Connect VCC and GND pins to battery pack leads (VCC-red, GND-black)
    // Connect GND pin and battery GND lead to GND pin on Huzzah
    var rightWheel = new five.Motor({ pins: [12, 2], invertPWM: false });
    var leftWheel = new five.Motor({ pins: [16, 13], invertPWM: false });

    var speed = 0;

    // function reverse() {
    //     leftWheel.rev(speed);
    //     rightWheel.rev(speed);
    //     console.log("Back it up...");
    // }
    function forward() {
        leftWheel.fwd(speed);
        rightWheel.fwd(speed);
        console.log("Forward!");
    }
    function stop() {
        leftWheel.rev(0);
        rightWheel.rev(0);
        console.log("STAHP");
    }
    function left() {
        leftWheel.rev(speed);
        rightWheel.fwd(speed);
        console.log("To the left...");
    }
    function right() {
        leftWheel.fwd(speed);
        rightWheel.rev(speed);
        console.log("To the right...");
    }
    function exit() {
        leftWheel.stop();
        rightWheel.stop();
        led.off();
        setTimeout(process.exit, 1000);
    }

    var keyMap = {
        'up': forward,
        // 'down': reverse,
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
        keyMap[key.name]();

    });
});
