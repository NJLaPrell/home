// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Rain',
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