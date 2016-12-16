// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: 'UPS Status',
	eventsListened: ['ups-status']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('ups-status', function(args){
		house.recordTriggeredListener('ups-status');
		house.setStatus('upsStatus', args);
		// Set the house to powered if the UPS reports online (as opposed to ONBATT)
		// This is used for initial state on server start.
		if(args.status == 'ONLINE' && !house.getStatus('powered')){
			house.setStatus('powered', true);
		}
	});
});

module.exports = listener;