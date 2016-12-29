// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Sunrise',
	description: 'Listens for the sunrise event, logs history, and turns the outside lights off.',
	eventsListened: ['sunrise'],
	eventsFired: ['trigger-toggleSwitch']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('sunrise', function(args){
		house.recordTriggeredListener('sunrise');
		house.logHistory("The sun rose.");

		// Toggle the status
		house.setStatus('daytime', true);
		house.setStatus('nighttime', false);

		// Turn off the Christmas lights
		house.logHistory("The Christmas lights were turned off.");
		house.triggerEvent("trigger-toggleSwitch", {name: "Christmas Lights 1", direction: "off"});
		house.triggerEvent("trigger-toggleSwitch", {name: "Christmas Lights 2", direction: "off"});
	});
});

module.exports = listener;