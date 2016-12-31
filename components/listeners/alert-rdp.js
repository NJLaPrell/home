// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var alert = require.main.require("./helpers/text-alert.js");
var date = require.main.require("./helpers/date-time.js");

var settings = {
	name: 'RDP Connection Alert',
	description: 'Fires a text alert when an RDP event is triggered.',
	eventsListened: ['rdp']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('rdp', function(args){
		house.recordTriggeredListener('RDP');
		house.setStatus('lastRDPConnection', date.getDateTime());
		alert("RDP Connection Detected");
		house.logHistory("An RDP connection was made to 192.168.0.25");
	});
});

module.exports = listener;