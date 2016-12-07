var log = require("../helpers/log.js");
var alert = require("../helpers/text-alert.js");
log.startup("Registering listener nick-home.js for event: gps");

module.exports = function(eventEmitter){
	eventEmitter.on('gps', function(args, house){
		if(args.person == 'nick' && args.location == 'home'){
			log.info("LISTENER: Nick has arrived home.");
			log.info("original value: " + house.getStatus('nickslocation'));
			alert("Detected that Nick has arrived home.");
			house.setStatus('nickslocation', 'home');
		}
	});
};