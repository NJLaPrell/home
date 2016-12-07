var log = require("../helpers/log.js");

module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.logTriggeredListener('weather');
		if(args.status == 'rain'){
			log.info("LISTENER: It is raining.");
		}
	});
};