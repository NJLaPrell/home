// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Edimax Switch Status',
	description: 'Listens for the switchStatus event fired by the switch poll and updates the status in the house status object.',
	eventsListened: ['poll-edimax-switch'],
	eventsFired: [],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('poll-edimax-switch', function(house, args){
	house.recordTriggeredListener('poll-edimax-switch');
	// Log the history
	var oldState = house.getStatus('plugs');
	var newState = null;
	for(var switchName in oldState){
		if(args[switchName] != oldState[switchName]){
			newState = args[switchName] ? 'on' : 'off';
			house.log.debug('The switch: "' + switchName + '" was turned ' + newState + '.');
		}
	}	
	house.setStatus('plugs', args);
});

module.exports = listener;