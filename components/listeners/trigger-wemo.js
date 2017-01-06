// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Wemo Command',
	description: 'Controls Wemo devices.',
	eventsListened: ['trigger-wemo'],
	eventsFired: [],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('trigger-wemo', function(house, args){
	house.servicesRegistered['Wemo'].device[args.device].setBinaryState(args.value);
});

module.exports = listener;