// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Sunset',
	description: 'Listens for the sunset event, logs history, changes the house status, and turns the outside lights on.',
	eventsListened: ['sunset'],
	eventsFired: ['trigger-lutron'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('sunset', function(house, args){
	house.recordTriggeredListener('sunset');
	house.logHistory("The sun set.");

	// Toggle the status
	house.setStatus('daytime', false);
	house.setStatus('nighttime', true);

	// Turn on the porch lights
	house.logHistory("The porch lights were turned on.");
	house.triggerEvent("trigger-lutron", {light:6, brightness: 100});
	house.triggerEvent("trigger-lutron", {light:7, brightness: 100});
});

module.exports = listener;