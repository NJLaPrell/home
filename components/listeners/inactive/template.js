// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: '***NAME***',
	description: '***DESCRIPTION***',
	eventsListened: ['***EVENTS***'],
	eventsTriggered: ['***EVENTS TRIGGERED***'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('***NAME***', function(house, args){
	house.recordTriggeredListener('***NAME***');
	// INSERT MAGIC HERE
});

module.exports = listener;