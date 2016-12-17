// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: 'Sunset',
	eventsListened: ['sunset']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('sunset', function(args){
		house.recordTriggeredListener('sunset');
		house.logHistory("The sun set.");
	});
});

module.exports = listener;