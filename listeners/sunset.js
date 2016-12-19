// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: 'Sunset',
	eventsListened: ['sunset']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('sunset', function(args){
		house.recordTriggeredListener('sunset');
		house.logHistory("The sun set.");

		// Turn on the Christmas Lights
		house.logHistory("The Christmas lights were turned on.");
		house.triggerEvent("trigger-toggleSwitch", {name: "Christmas Lights 1", direction: "on"});
		house.triggerEvent("trigger-toggleSwitch", {name: "Christmas Lights 2", direction: "on"});
	});
});

module.exports = listener;