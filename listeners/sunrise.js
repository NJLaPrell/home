var log = require("../helpers/log.js");

module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.logTriggeredListener('weather');
		if(args.status == 'sunrise'){
			log.info("LISTENER: The sun has risen.");
			home.setStatus('daytime', true);
			home.setStatus('nighttime', false);
		}
	});
};