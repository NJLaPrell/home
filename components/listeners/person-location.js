// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Person Location',
	description: 'Listens for GPS updates and syncs house status and logs to history as appropriate.',
	eventsListened: ['gps']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('gps', function(args){
		house.recordTriggeredListener('gps');
		var person = args.person == 'nick' ? 'nickslocation' : 'brendaslocation';
		house.setStatus(person, args.location);

		var history = args.person == 'nick' ? 'Nick' : 'Brenda';
		history += args.location == 'home' ? ' has arrived home.' : ' has left home.';
		house.logHistory(history);
	});
});

module.exports = listener;