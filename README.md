# home
Misc home automation scripts in node.js

Not fit for public use beyond example code, as this is very specific to my hardware. 

FEATURES:
* jobs.js runs as a cron style task manager.
* start/stop/restart bash scripts use forever to run the node.js applications.
* server.js is a REST interface to trigger automation.
* hue-animation.js provides Hue light animation functions.
* rokus.js provides a few basic commands to Roku (on/off and a few channels).
* wemo.js sets up fake wemo switches to enable on/off voice commands from Alexa.

1. Rename EXAMPLEconfig.js to config.js.
2. Edit config.js with the correct settings.
3. Run "npm install" to install dependencies
