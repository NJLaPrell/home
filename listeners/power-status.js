var alert = require("../helpers/text-alert.js");
module.exports = function(house){
	house.listenForEvent('ups', function(args){
		var date = new Date();
		house.recordTriggeredListener('ups');
		var powered = args.powerStatus == 'off' ? false : true;
		house.setStatus('powered', powered);
		if(!powered){
			house.logHistory("Power was lost.");
			alert("POWER LOSS - The UPS has been triggered, indicating a power outage.");
			house.setStatus('powerOutSince', date.toString());
		} else {
			house.logHistory("Power was restored.");
			alert("POWER RESTORED - The UPS has detected that power has been restored.");
			house.setStatus('powerOutSince', null);
		}
	});
};