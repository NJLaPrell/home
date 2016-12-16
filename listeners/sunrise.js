// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: 'Sunrise',
	eventsListened: ['weather']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('sunrise');
		house.logHistory("The sun rose.");
	});
});

module.exports = listener;