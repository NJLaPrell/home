// Imported Modules
var Service = require.main.require('./helpers/service.js');
var FauxMo = require('fauxmojs');
var roku = require.main.require('./helpers/roku.js');

var settings = {
	name: 'FauxMo Switches',
	type: 'TCP/IP',
	description: 'Fake Wemo switch service. Each switch registered can be discovered by Amazon Alexa and is able to receive an action of "on" or "off."',
	eventsTriggered: ['trigger-edimax-switch', 'trigger-hueLights']
};

var service = new Service(settings);

service.setService(function(house){


	var fauxMo = new FauxMo(
	  {
	    ipAddress: house.conf.localIP,
	    devices: [
	      {
	        name: 'faux television switch',
	        port: 11001,
	        handler: (action) => {
	          roku.executeCommand("power-" + action, function(response){
	            var payload = {};
	            if(response.status!=200){
	              house.log.error("Failed to execute faux tv switch: " + action + "- " + response.message);
	            } else {
	              house.log.debug("Executed faux tv switch: " + action);
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
	              house.log.error("Failed to execute Netflix switch - " + response.message);
	            } else {
	              house.log.debug("Executed Netflix switch.");
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
	              house.log.error("Failed to execute Hulu switch - " + response.message);
	            } else {
	              house.log.debug("Executed Hulu switch.");
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
	              house.log.error("Failed to execute Plex switch - " + response.message);
	            } else {
	              house.log.debug("Executed Plex switch.");
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
	              house.log.error("Failed to execute Amazon switch - " + response.message);
	            } else {
	              house.log.debug("Executed Amazon switch.");
	            }
	          });
	        }
	      },
	      {
	        name: 'Tiffany Lamp',
	        port: 11006,
	        handler: (action) => {
	          house.triggerEvent('trigger-edimax-switch', {name: "Tiffany Lamp", direction: action});
	        }
	      },
	      {
	        name: 'Outside Lights',
	        port: 11007,
	        handler: (action) => {
	          house.triggerEvent('trigger-edimax-switch', {name: "Christmas Lights 1", direction: action});
	          house.triggerEvent('trigger-edimax-switch', {name: "Christmas Lights 2", direction: action});
	        }
	      },
	      {
	        name: 'Christmas',
	        port: 11010,
	        handler: (action) => {
	          house.triggerEvent('trigger-hueLights', {christmasMode: true, toggle: action});
	          house.triggerEvent('trigger-hueLights', {christmasMode: true, toggle: action});
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
	              house.log.error("Failed to execute Volume switch: " + action + " - " + response.message);
	            } else {
	              house.log.debug("Executed Volume: " + action + ".");
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
	              house.log.error("Failed to execute mute switch: " + response.message);
	            } else {
	              house.log.debug("Executed Mute switch.");
	            }
	          });
	        }
	      }
	    ]
	  });

});

module.exports = service;