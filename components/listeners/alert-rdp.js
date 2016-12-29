// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var alert = require.main.require("./helpers/text-alert.js");
var date = require.main.require("./helpers/date-time.js");

var settings = {
	name: 'RDP Connection Alert',
	description: 'Fires a text alert when an RDP event is triggered.',
	eventsListened: ['RDP']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('RDP', function(args){
		house.recordTriggeredListener('RDP');
		house.setStatus('lastRDPConnection', date.getDateTime());
		alert("RDP Connection Detected");
	});
});

module.exports = listener;