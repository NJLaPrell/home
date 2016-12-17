// Imported Modules
var Listener = require('../helpers/listener.js');
var Hue = require('../helpers/hue-lights.js');

var settings = {
	name: 'Hue Lights Command',
	eventsListened: ['trigger-hueLights']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	var hue = new Hue(house);

	// Make sure we have Hue Light data available
	hue.getState().then(function(response){
		house.setStatus('hue', response);
		house.log.startup("Retrieved Hue status data.");
	});

	house.listenForEvent('trigger-hueLights', function(args){
		house.recordTriggeredListener('trigger-hueLights');
		hue.toggleState(args.lightID, args.direction);
	});
});

module.exports = listener;