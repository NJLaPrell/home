// Imported Modules
var Listener = require('../helpers/listener.js');
var roku = require('../helpers/roku'); 

var settings = {
	name: 'Roku Commands',
	eventsListened: ['trigger-roku']
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