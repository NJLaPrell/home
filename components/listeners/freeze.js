// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Freezing',
	description: 'Logs a history entry if the outside temperature drops below freezing.',
	eventsListened: ['weather'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('weather', function(house, args){
	if(args.status == 'freezeing'){
		house.logHistory("Outside temperature dropped below freezing.");
	}
});

module.exports = listener;