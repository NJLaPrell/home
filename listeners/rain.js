var log = require("../helpers/log.js");
log.info("Registering listener rain.js for event: weather");

module.exports = function(eventEmitter){
	eventEmitter.on('weather', function(args){
		if(args.status == 'rain'){
			log.info("LISTENER: It is raining.");
		}
	});
};