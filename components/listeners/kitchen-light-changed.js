// Imported Modules
var Listener = require.main.require('./helpers/listener.js');


var settings = {
	name: 'Kitchen Light Sync',
	description: 'Synchronizes the kitchen lights.',
	eventsListened: ['lutron-changed'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('lutron-changed', function(house, args){
	if(args.deviceID == 2){
		house.triggerEvent('trigger-hue-lights', {lightID: 6, bri: (args.brightness * 2.54)});
	}
});

module.exports = listener;