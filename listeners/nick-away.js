var log = require("../helpers/log.js");
var alert = require("../helpers/text-alert.js");
log.info("Registering listener nick-away.js for event: gps");

module.exports = function(eventEmitter){
	eventEmitter.on('gps', function(args){
		if(args.person == 'nick' && args.location == 'away'){
			log.info("LISTENER: Nick has left home.");
			alert("Detected that Nick is no longer home");
		}
	});
};