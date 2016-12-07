var log = require("../helpers/log.js");
var alert = require("../helpers/text-alert.js");
log.info("Registering listener nick-home.js for event: gps");

module.exports = function(eventEmitter){
	eventEmitter.on('gps', function(args){
		if(args.person == 'nick' && args.location == 'home'){
			log.info("LISTENER: Nick has arrived home.");
			alert("Detected that Nick has arrived home.");
		}
	});
};