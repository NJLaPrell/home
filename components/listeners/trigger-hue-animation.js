// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var HueAnimation = require.main.require('./helpers/hue-animation.js');

var settings = {
	name: 'Hue Animation Command',
	description: 'Triggers hue animations.',
	eventsListened: ['trigger-hueAnimation'],
	eventsFired: [],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('trigger-hue-animation', function(house, args){
	var animation = new HueAnimation();
	house.recordTriggeredListener('trigger-hue-animation');
	house.log.debug("Panic mode triggered.");
	if(args.panic){
		animation.trigger("panic");
	}		
});

module.exports = listener;