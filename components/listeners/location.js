// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Person Location',
	description: 'Listens for location updates and syncs house status.',
	eventsListened: ['location'],
	shutdownThreshold: 3
};

var listener = new Listener(settings);

listener.registerListener('location', function(house, args){
	var person = args.person == 'nick' ? 'nickslocation' : 'brendaslocation';
	house.setStatus(person, args.location);
});

module.exports = listener;