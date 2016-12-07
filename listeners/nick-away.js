var log = require("../helpers/log.js");
var alert = require("../helpers/text-alert.js");
log.startup("Registering listener nick-away.js for event: gps");

module.exports = function(house){
	house.listenForEvent('gps', function(args){
		if(args.person == 'nick' && args.location == 'away'){
			log.info("LISTENER: Nick has left home.");
			house.setStatus('nickslocation', 'away');
			alert("Detected that Nick is no longer home");
		}
	});
};