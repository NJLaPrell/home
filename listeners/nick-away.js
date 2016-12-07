var log = require("../helpers/log.js");
var alert = require("../helpers/text-alert.js");

module.exports = function(house){
	house.listenForEvent('gps', function(args){
		house.logTriggeredListener('gps');
		if(args.person == 'nick' && args.location == 'away'){
			house.setStatus('nickslocation', 'away');
			alert("Detected that Nick is no longer home");
		}
	});
};