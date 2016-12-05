var log = require("../helpers/log.js");
log.info("Registering listener nick-away.js for event: gps");

module.exports = function(eventEmitter){
	eventEmitter.on('gps', function(args){
		if(args.person == 'nick' && args.location == 'away'){
			log.info("LISTENER: Nick has left home.");
		}
	});
};