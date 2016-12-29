// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var roku = require.main.require('./helpers/roku'); 

var settings = {
	name: 'Roku Commands',
	description: 'Sends commands to Roku.',
	eventsListened: ['trigger-roku'],
	eventsFired: []
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('trigger-roku', function(args){
		house.recordTriggeredListener('trigger-roku');
		roku.executeCommand(args.command, function(response){
			if(response.status < 200 || response.status <= 300){
				house.log.warning("Found Roku powered off.");
			}	
		});
	});
});

module.exports = listener;