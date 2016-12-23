// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Freezing',
	eventsListened: ['weather']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('weather');
		if(args.status == 'freezeing'){
			house.logHistory("Outside temperature dropped below freezing.");
		}
	});
});

module.exports = listener;