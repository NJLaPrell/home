// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var roku = require.main.require('./helpers/roku'); 

var settings = {
	name: 'TV Check',
	eventsListened: ['tv-status']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('tv-status', function(args){
		house.recordTriggeredListener('tv-status');
		house.setStatus('tvStatus', args.status);
		if(args.status == 'off'){
			roku.executeCommand("wake", function(response){
				if(response.status < 200 || response.status <= 300){
					house.log.warning("Found Roku powered off. Can't wake it. He's dead, Jim.\rResponse: " + JSON.stringify(response));
				}	
			});
		}
	});
});

module.exports = listener;