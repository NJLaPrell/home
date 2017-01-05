// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Lutron Lights Command',
	description: 'Turns Lutron lights on or off.',
	eventsListened: ['trigger-lutron'],
	eventsFired: [],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('trigger-lutron', function(house, args){
	house.recordTriggeredListener('trigger-lutron');
	var brightness = args.direction ? (args.direction == 'on' ? 100 : 0) : args.brightness;
	house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(args.light, brightness);		
});

module.exports = listener;