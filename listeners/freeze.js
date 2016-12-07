var log = require("../helpers/log.js");
log.startup("Registering listener freeze.js for event: weather");

module.exports = function(house){
	house.listenForEvent('weather', function(args){
		if(args.status == 'freezeing'){
			log.info("LISTENER: It is below freezing.");
		}
	});
};