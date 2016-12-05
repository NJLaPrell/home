var log = require("../helpers/log.js");
log.info("Registering listener nick-home.js for event: gps");

module.exports = function(eventEmitter){
	eventEmitter.on('gps', function(args){
		if(args.person == 'nick' && args.location == 'home'){
			log.info("LISTENER: Nick has arrived home.");
		}
	});
};