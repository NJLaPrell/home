// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var roku = require.main.require('./helpers/roku'); 

var settings = {
	name: 'Roku Commands',
	description: 'Sends commands to Roku.',
	eventsListened: ['trigger-roku'],
	eventsFired: [],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('trigger-roku', function(house, args){
	roku.executeCommand(args.command, function(response){
		if(response.status < 200 || response.status <= 300){
			house.log.warning("Found Roku powered off.");
		}	
	});
});

module.exports = listener;