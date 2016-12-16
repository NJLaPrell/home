// Imported Modules
var Listener = require('../helpers/listener.js');
var alert = require("../helpers/text-alert.js");
var date = require("../helpers/date-time.js");

var settings = {
	name: 'Power Status',
	eventsListened: ['ups']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('ups', function(args){
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
});

module.exports = listener;