// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: 'Sunrise',
	eventsListened: ['sunrise']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('sunrise', function(args){
		house.recordTriggeredListener('sunrise');
		house.logHistory("The sun rose.");
	});
});

module.exports = listener;