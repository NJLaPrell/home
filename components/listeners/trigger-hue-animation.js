// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var HueAnimation = require.main.require('./helpers/hue-animation.js');

var settings = {
	name: 'Hue Animation Command',
	eventsListened: ['trigger-hueAnimation']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	var animation = new HueAnimation();
	house.listenForEvent('trigger-hueAnimation', function(args){
		house.recordTriggeredListener('trigger-hueAnimation');
		house.log.debug("Panic mode triggered.");
		if(args.panic){
			animation.trigger("panic");
		}		
	});
});

module.exports = listener;