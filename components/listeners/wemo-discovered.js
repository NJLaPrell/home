// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Wemo Discovered',
	description: 'Handles discovered Wemo devices.',
	eventsListened: ['wemo-discovered'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('wemo-discovered', function(house, args){
	house.status.wemo[args.device] = args.info;
});

module.exports = listener;