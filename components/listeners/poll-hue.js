// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var hue = require.main.require('./helpers/hue-lights.js');

var settings = {
	name: 'Hue Light Status',
	description: 'Listens for the current status of the Hue lights and updates the house status object.',
	eventsListened: ['poll-hue'],
	shutdownThreshold: 10
};

var listener = new Listener(settings);

listener.registerListener('poll-hue', function(house, args){
	var hue = house.getStatus('hue');
	hue.lights = {};
	for(var key in args){
		hue.lights[key] = args[key];
	}
	house.setStatus('hue', hue);
});

module.exports = listener;