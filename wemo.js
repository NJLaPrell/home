var Log = require("./helpers/log");
var conf = require('./config');
var log = new Log(conf.debug);
var FauxMo = require('fauxmojs');
var roku = require('./helpers/roku');
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
          roku.executeCommand("power-" + action, function(response){
            var payload = {};
            if(response.status!=200){
              log.error("Failed to execute faux tv switch: " + action + "- " + response.message);
            } else {
              log.debug("Executed faux tv switch: " + action);
            }
          });
        }
      },
      {
        name: 'Netflix',
        port: 11002,
        handler: (action) => {
          roku.executeCommand("netflix", function(response){
            var payload = {};
            if(response.status!=200){
              log.error("Failed to execute Netflix switch - " + response.message);
            } else {
              log.debug("Executed Netflix switch.");
            }
          });
        }
      },
      {
        name: 'Hulu',
        port: 11003,
        handler: (action) => {
          roku.executeCommand("hulu", function(response){
            var payload = {};
            if(response.status!=200){
              log.error("Failed to execute Hulu switch - " + response.message);
            } else {
              log.debug("Executed Hulu switch.");
            }
          });
        }
      },
      {
        name: 'Plex',
        port: 11004,
        handler: (action) => {
          roku.executeCommand("plex", function(response){
            var payload = {};
            if(response.status!=200){
              log.error("Failed to execute Plex switch - " + response.message);
            } else {
              log.debug("Executed Plex switch.");
            }
          });
        }
      },
      {
        name: 'Amazon',
        port: 11005,
        handler: (action) => {
          roku.executeCommand("amazon", function(response){
            var payload = {};
            if(response.status!=200){
              log.error("Failed to execute Amazon switch - " + response.message);
            } else {
              log.debug("Executed Amazon switch.");
            }
          });
        }
      },
      {
        name: 'Tiffany Lamp',
        port: 11006,
        handler: (action) => {
          triggerEvent('trigger-toggleSwitch', {name: "Tiffany Lamp", direction: action});
        }
      },
      {
        name: 'Outside Lights',
        port: 11007,
        handler: (action) => {
          triggerEvent('trigger-toggleSwitch', {name: "Christmas Lights 1", direction: action});
          triggerEvent('trigger-toggleSwitch', {name: "Christmas Lights 2", direction: action});
        }
      },
      {
        name: 'Christmas',
        port: 11010,
        handler: (action) => {
          triggerEvent('trigger-hueLights', {christmasMode: true, toggle: action});
          triggerEvent('trigger-hueLights', {christmasMode: true, toggle: action});
        }
      },
      {
        name: 'Volume',
        port: 11011,
        handler: (action) => {
          var cmd = action == 'on' ? 'volume-up' : 'volume-down';
          roku.executeCommand(cmd, function(response){
            var payload = {};
            if(response.status!=200){
              log.error("Failed to execute Volume switch: " + action + " - " + response.message);
            } else {
              log.debug("Executed Volume: " + action + ".");
            }
          });
        }
      },
      {
        name: 'Mute',
        port: 11009,
        handler: (action) => {
          roku.executeCommand("mute", function(response){
            var payload = {};
            if(response.status!=200){
              log.error("Failed to execute mute switch: " + response.message);
            } else {
              log.debug("Executed Mute switch.");
            }
          });
        }
      }
    ]
  });

console.log("********** STARTUP COMPLETE **********\r\n\r\n");