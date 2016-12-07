var log = require("../helpers/log.js");
var alert = require("../helpers/text-alert.js");
log.startup("Registering listener nick-away.js for event: gps");

module.exports = function(eventEmitter){
	eventEmitter.on('gps', function(args, house){
		if(args.person == 'nick' && args.location == 'away'){
			log.info("LISTENER: Nick has left home.");
			log.info("original value: " + house.getStatus('nickslocation'));
			alert("Detected that Nick is no longer home");
			shouse.setStatus('nickslocation','away');
		}
	});
};