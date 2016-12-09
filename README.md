# nodebots

A work in progress.

# Software requirements
 - [Arduino IDE](https://www.arduino.cc/en/Main/Software), v. 1.6.4 or greater
 - [git](https://git-scm.com/)
 - [node](https://nodejs.org/en/)

# Instructions

## Setting up the Feather HUZZAH with Johnny-Five and WiFi communication
 1. [Download](https://www.silabs.com/products/mcu/Pages/USBtoUARTBridgeVCPDrivers.aspx) and install the USB driver for your OS.
 2. Follow only Step 1 and Step 2 on [this website](http://www.samjulien.com/johnny-feather/). In Step 2, you may need to change the git command to ``git clone https://github.com/firmata/arduino.git ~/Documents/Arduino/libraries/Firmata``. Important: Be sure that your laptop and the device are connecting to the same WiFi SSID!
 
## Downloading the code to control your bot
 3. Clone this repo to your local machine (``git clone https://github.com/hxlnt/feather-nodebot.git``).
 4. ``cd feather-nodebot``
 5. ``npm install``
 
## Registering your device on the "Robotic Traces" Azure IoT dashboard 
 6. ``npm install -g iothub-explorer``
 7. ``iothub-explorer login "HostName=huzzahbots.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=SHARED_ACCESS_KEY_GOES_HERE"`` (Replace ``SHARED_ACCESS_KEY_GOES_HERE`` with the shared access key provided to you separately.)
 8. ``iothub-explorer create my-cool-device-name --connection-string`` where ``my-cool-device-name`` is whatever you want your device to be called. Take note of this name as well as the primary key returned back from the command line tool.
 9. Update index.js to contain your device's ID (name), primary key, and IP address (from Step 2 above).
 
## Drive your bot all around town!
 10. ``npm start``
 11. You should see an output similar to this one upon a successful connection:
```
1481283325844 Device(s) Firmata
1481283345878 Connected Firmata
1481283369317 Repl Initialized
>> STAHP
Client connected
```
Use the keyboard keys up, right, and left to drive the car. Press the space bar to stop the car. Press q to quit.

## Coming soon: Link to the Robotic Traces Azure IoT dashboard, where you can see a visualization of the motion of all connected cars.
