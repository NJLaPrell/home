var log = require("../helpers/log.js");
log.info("Registering listener sunrise.js for event: weather");

module.exports = function(eventEmitter){
	eventEmitter.on('weather', function(args){
		if(args.status == 'sunrise'){
			log.info("LISTENER: The sun has risen.");
		}
	});
};