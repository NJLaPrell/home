// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Person Location',
	description: 'Listens for location updates and syncs house status.',
	eventsListened: ['location']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('location', function(args){
		house.recordTriggeredListener('location');
		var person = args.person == 'nick' ? 'nickslocation' : 'brendaslocation';
		house.setStatus(person, args.location);
	});
});

module.exports = listener;