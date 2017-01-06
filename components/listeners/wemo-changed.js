// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Wemo Change',
	description: 'Handles changes in Wemo device states.',
	eventsListened: ['wemo-changed'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('wemo-changed', function(house, args){
	house.status.wemo[args.device].binaryState = args.value;
});

module.exports = listener;