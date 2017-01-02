// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Sunrise',
	description: 'Listens for the sunrise event, logs history, and turns the outside lights off.',
	eventsListened: ['sunrise'],
	eventsFired: ['trigger-edimax-switch']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('sunrise', function(args){
		house.recordTriggeredListener('sunrise');
		house.logHistory("The sun rose.");

		// Toggle the status
		house.setStatus('daytime', true);
		house.setStatus('nighttime', false);

		// Turn off the porch lights
		house.logHistory("The porch lights were turned off.");
		house.triggerEvent("trigger-lutron", {light:6, brightness: 0});
		house.triggerEvent("trigger-lutron", {light:7, brightness: 0});
	});
});

module.exports = listener;