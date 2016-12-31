// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Sunset',
	description: 'Listens for the sunset event, logs history, changes the house status, and turns the outside lights on.',
	eventsListened: ['sunset'],
	eventsFired: ['trigger-edimax-switch']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('sunset', function(args){
		house.recordTriggeredListener('sunset');
		house.logHistory("The sun set.");

		// Toggle the status
		house.setStatus('daytime', false);
		house.setStatus('nighttime', true);

		// Turn on the Christmas Lights
		house.logHistory("The Christmas lights were turned on.");
		house.triggerEvent("trigger-edimax-switch", {name: "Christmas Lights 1", direction: "on"});
		house.triggerEvent("trigger-edimax-switch", {name: "Christmas Lights 2", direction: "on"});
	});
});

module.exports = listener;