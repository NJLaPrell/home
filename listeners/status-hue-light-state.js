// Imported Modules
var Listener = require('../helpers/listener.js');
var hue = require('../helpers/hue-lights.js');

var settings = {
	name: 'Hue Light Status',
	eventsListened: ['status-hueLightStates']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('status-hueLightStates', function(args){
		house.recordTriggeredListener('status-hueLightStates');
		var hue = house.getStatus('hue');
		hue.lights = {};
		for(var key in args){
			hue.lights[key] = args[key];
		}
		house.setStatus('hue', hue);
	});
});

module.exports = listener;