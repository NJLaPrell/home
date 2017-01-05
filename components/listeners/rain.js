// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Rain',
	description: 'Checks the weather event to see if it is raining and logs history.',
	eventsListened: ['weather'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('weather', function(house, args){
	if(args.status == 'rain'){
		house.logHistory("It was raining.");
	}
});

module.exports = listener;