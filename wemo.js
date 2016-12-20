var log = require("./helpers/log");
var conf = require('./config');
var FauxMo = require('fauxmojs');
var triggerEvent = require('./helpers/trigger-event.js');

log.startup("STARTING SERVICE: wemo.js");

var fauxMo = new FauxMo(
  {
    ipAddress: conf.localIP,
    devices: [
      {
        name: 'faux television switch',
        port: 11001,
        handler: (action) => {
          triggerEvent('trigger-roku', {command: "power-" + action});
        }
      },
      {
        name: 'Netflix',
        port: 11002,
        handler: (action) => {
          triggerEvent('trigger-roku', {command: "netflix"});
        }
      },
      {
        name: 'Hulu',
        port: 11003,
        handler: (action) => {
          triggerEvent('trigger-roku', {command: "hulu"});
        }
      },
      {
        name: 'Plex',
        port: 11004,
        handler: (action) => {
          triggerEvent('trigger-roku', {command: "plex"});
        }
      },
      {
        name: 'Amazon',
        port: 11005,
        handler: (action) => {
          triggerEvent('trigger-roku', {command: "amazon"});
        }
      },
      {
        name: 'Tiffany Lamp',
        port: 11006,
        handler: (action) => {
          triggerEvent('trigger-toggleSwitch', {name: "Tiffany Lamp", direction: action});
        }
      }
    ]
  });

console.log("********** STARTUP COMPLETE **********\r\n\r\n");