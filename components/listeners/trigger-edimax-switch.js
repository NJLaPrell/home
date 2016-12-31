// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var Plug = require.main.require('./helpers/smart-plug.js');

var settings = {
	name: 'Edimax Switch Toggle',
	description: 'Toggles Edimax switches on or off.',
	eventsListened: ['trigger-edimax-switch'],
	eventsFired: []
};

var listener = new Listener(settings);

listener.setListener(function(house){
	var plug = new Plug(house);
	house.listenForEvent('trigger-edimax-switch', function(args){
		house.recordTriggeredListener('trigger-edimax-switch');
		plug.toggle(args.name, args.direction);
	});
});

module.exports = listener;