// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var Plug = require.main.require('./helpers/smart-plug.js');

var settings = {
	name: 'Edimax Switch Toggle',
	description: 'Toggles Edimax switches on or off.',
	eventsListened: ['trigger-toggleSwitch'],
	eventsFired: []
};

var listener = new Listener(settings);

listener.setListener(function(house){
	var plug = new Plug(house);
	house.listenForEvent('trigger-toggleSwitch', function(args){
		house.recordTriggeredListener('trigger-toggleSwitch');
		plug.toggle(args.name, args.direction);
	});
});

module.exports = listener;