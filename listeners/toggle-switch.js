// Imported Modules
var Listener = require('../helpers/listener.js');
var plug = require('../helpers/smart-plug.js');

var settings = {
	name: 'Edimax Switch Toggle',
	eventsListened: ['trigger-toggleSwitch']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('trigger-toggleSwitch', function(args){
		house.recordTriggeredListener('trigger-toggleSwitch');
		plug.toggle(args.name, args.direction);
	});
});

module.exports = listener;