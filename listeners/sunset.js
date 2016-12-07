var log = require("../helpers/log.js");

module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.logTriggeredListener('weather');
		if(args.status == 'sunset'){
			log.info("LISTENER: The sun has set.");
			home.setStatus('daytime', false);
			home.setStatus('nighttime', true);
		}
	});
};