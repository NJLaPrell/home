var log = require("../helpers/log.js");
log.info("Registering listener email-received.js for event: email-received");

module.exports = function(eventEmitter){
	eventEmitter.on('email-received', function(args){
		if(args.status == 'freezeing'){
			log.info("LISTENER: Email Received");
			log.info(args);
		}
	});
};