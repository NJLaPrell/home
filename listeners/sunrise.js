var log = require("../helpers/log.js");
log.startup("Registering listener sunrise.js for event: weather");

module.exports = function(house){
	house.listenForEvent('weather', function(args){
		if(args.status == 'sunrise'){
			log.info("LISTENER: The sun has risen.");
		}
	});
};