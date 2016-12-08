var alert = require("../helpers/text-alert.js");
module.exports = function(house){
	house.listenForEvent('ups', function(args){
		house.recordTriggeredListener('ups');
		house.setStatus('powered', args.powerStatus);
		if(args.powerStatus){
			alert("POWER LOSS - The UPS has been triggered, indicating a power outage.");
		} else {
			alert("POWER RESTORED - The UPS has detected that power has been restored.");
		}
	});
};