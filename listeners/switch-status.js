// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: 'Edimax Switch Status',
	eventsListened: ['switchStatus']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('switchStatus', function(args){
		house.recordTriggeredListener('switchStatus');
		// Log the history
		var oldState = house.getStatus('plugs');
		var newState = null;
		for(var switchName in oldState){
			if(args[switchName] != oldState[switchName]){
				newState = args[switchName] ? 'on' : 'off';
				house.logHistory('The switch: "' + switchName + '" was turned ' + newState + '.');
			}
		}	
		house.setStatus('plugs', args);
	});
});

module.exports = listener;