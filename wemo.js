var log = require("./helpers/log");
var conf = require('./config');
var FauxMo = require('fauxmojs');
var roku = require('./helpers/roku');
var triggerEvent = require('./helpers/trigger-event.js');

log.startup("STARTING SERVICE");

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
      }
    ]
  });

console.log("********** STARTUP COMPLETE **********\r\n\r\n");