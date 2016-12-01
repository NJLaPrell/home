var log = function(msg, type){
  var currentDate = new Date();
  console.log(currentDate.toString() + " - " + type + ": wemo.js\r\n" + msg + "\r\n\r\n");
};
 

var conf = require('./config');
var FauxMo = require('fauxmojs');
var roku = require('./helpers/roku');
 
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
              log("Failed to execute faux tv switch: " + action + "- " + response.message, "ERROR");
            } else {
              log("Executed faux tv switch: " + action, "INFO");
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
              log("Failed to execute Netflix switch - " + response.message, "ERROR");
            } else {
              log("Executed Netflix switch.", "INFO");
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
              log("Failed to execute Hulu switch - " + response.message, "ERROR");
            } else {
              log("Executed Hulu switch.", "INFO");
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
              log("Failed to execute Plex switch - " + response.message, "ERROR");
            } else {
              log("Executed Plex switch.", "INFO");
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
              log("Failed to execute Amazon switch - " + response.message, "ERROR");
            } else {
              log("Executed Amazon switch.", "INFO");
            }
          });
        }
      }
    ]
  });
 
log("Started wemo.js service.", "INFO");