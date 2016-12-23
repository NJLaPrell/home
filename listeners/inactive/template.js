// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: '***NAME***',
	eventsListened: ['***EVENTS***'],
	eventsTriggered: ['***EVENTS TRIGGERED***']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('***NAME***', function(args){
		house.recordTriggeredListener('***NAME***');
		// INSERT MAGIC HERE
	});
});

module.exports = listener;