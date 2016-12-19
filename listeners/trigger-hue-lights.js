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
	});

	house.listenForEvent('trigger-hueLights', function(args){
		house.recordTriggeredListener('trigger-hueLights');
		if(args.direction){
			hue.toggleState(args.lightID, args.direction);
		} else if(args.bri){
			hue.setBrightness(args.lightID, args.bri);
		}
		
	});
});

module.exports = listener;