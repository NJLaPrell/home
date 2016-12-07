var log = require("../helpers/log.js");
log.startup("Registering listener sunset.js for event: weather");

module.exports = function(house){
	house.listenForEvent('weather', function(args){
		if(args.status == 'sunset'){
			log.info("LISTENER: The sun has set.");
		}
	});
};