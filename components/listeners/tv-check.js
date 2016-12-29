// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var roku = require.main.require('./helpers/roku'); 

var settings = {
	name: 'TV Check',
	description: 'Checks to see if the TV is powered off. If it is, it is powered back on with the screen off so it continues to receive commands.',
	eventsListened: ['tv-status'],
	eventsFired: []
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('tv-status', function(args){
		house.recordTriggeredListener('tv-status');
		house.setStatus('tvStatus', args.status);
		if(args.status == 'off'){
			roku.executeCommand("wake", function(response){
				if(response.status < 200 || response.status >= 300){
					house.log.warning("Found Roku powered off. Can't wake it. He's dead, Jim.\rResponse: " + JSON.stringify(response));
				}	
			});
		}
	});
});

module.exports = listener;