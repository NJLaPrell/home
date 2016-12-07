var alert = require("../helpers/text-alert.js");

module.exports = function(house){
	house.listenForEvent('gps', function(args){
		house.recordTriggeredListener('gps');
		if(args.person == 'nick' && args.location == 'away'){
			house.setStatus('nickslocation', 'away');
			alert("Detected that Nick is no longer home");
		}
	});
};