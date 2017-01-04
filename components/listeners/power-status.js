// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var alert = require.main.require("./helpers/text-alert.js");
var date = require.main.require("./helpers/date-time.js");

var settings = {
	name: 'Power Status',
	description: 'Listens for the power outage notifications triggered by the UPS and logs status and history and sends text alerts.',
	eventsListened: ['ups'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('ups', function(house, args){
	house.recordTriggeredListener('ups');
	var powered = args.powerStatus == 'off' ? false : true;
	house.setStatus('powered', powered);
	if(!powered){
		house.logHistory("Power was lost.");
		alert("POWER LOSS - The UPS has been triggered, indicating a power outage.");
		house.setStatus('powerOutSince', date.getDateTime());
	} else {
		house.logHistory("Power was restored.");
		alert("POWER RESTORED - The UPS has detected that power has been restored.");
		house.setStatus('powerOutSince', null);
	}
});

module.exports = listener;