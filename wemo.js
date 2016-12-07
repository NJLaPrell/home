var log = require("./helpers/log");
var conf = require('./config');
var FauxMo = require('fauxmojs');
var roku = require('./helpers/roku');

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
            } else {
              log.info("Executed faux tv switch: " + action);
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
              log.info("Executed Netflix switch.");
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
              log.info("Executed Hulu switch.");
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
              log.info("Executed Plex switch.");
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
              log.info("Executed Amazon switch.");
            }
          });
        }
      }
    ]
  });

console.log("********** STARTUP COMPLETE **********\r\n\r\n");