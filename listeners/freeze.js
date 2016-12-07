var log = require("../helpers/log.js");

module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.logTriggeredListener('weather');
		if(args.status == 'freezeing'){
			log.info("LISTENER: It is below freezing.");
		}
	});
};