var log = require("../helpers/log.js");
log.startup("Registering listener email-received.js for event: email-received");

module.exports = function(house){
	house.listenForEvent('email-received', function(args){
		if(args.status == 'freezeing'){
			log.info("LISTENER: Email Received");
			log.info(args);
		}
	});
};