// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Rain',
	description: 'Checks the weather event to see if it is raining and logs history.',
	eventsListened: ['weather']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('weather');
		if(args.status == 'rain'){
			house.logHistory("It was raining.");
		}
	});
});

module.exports = listener;