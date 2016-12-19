// Imported Modules
var Listener = require('../helpers/listener.js');

var settings = {
	name: 'Sunrise',
	eventsListened: ['sunrise']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('sunrise', function(args){
		house.recordTriggeredListener('sunrise');
		house.logHistory("The sun rose.");

		// Turn off the Christmas lights
		house.logHistory("The Christmas lights were turned on.");
		house.triggerEvent("trigger-toggleSwitch", {name: "Christmas Lights 1", direction: "off"});
		house.triggerEvent("trigger-toggleSwitch", {name: "Christmas Lights 2", direction: "off"});
	});
});

module.exports = listener;