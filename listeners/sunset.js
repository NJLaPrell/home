// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: 'Sunset',
	eventsListened: ['weather']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('sunset');
		house.logHistory("The sun set.");
	});
});

module.exports = listener;