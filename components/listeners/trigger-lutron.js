// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Lutron Lights Command',
	description: 'Turns Lutron lights on or off.',
	eventsListened: ['trigger-lutron'],
	eventsFired: []
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('trigger-lutron', function(args){
		house.recordTriggeredListener('trigger-lutron');
		var brightness = args.direction ? (args.direction == 'on' ? 100 : 0) : args.brightness;
		house.lutron.setBrightness(args.light, brightness);		
	});
});

module.exports = listener;