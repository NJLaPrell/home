// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'UPS Status',
	description: 'Listens to the ups-status event fired from the UPS poll and updates the house status with the args.',
	eventsListened: ['poll-ups'],
	eventsFired: [],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('poll-ups', function(house, args){
	house.setStatus('upsStatus', args);
	// Set the house to powered if the UPS reports online (as opposed to ONBATT)
	// This is used for initial state on server start.
	if(args.status == 'ONLINE' && !house.getStatus('powered')){
		house.setStatus('powered', true);
	}
});

module.exports = listener;