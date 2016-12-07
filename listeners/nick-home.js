var log = require("../helpers/log.js");
var alert = require("../helpers/text-alert.js");
log.startup("Registering listener nick-home.js for event: gps");

module.exports = function(house){
	house.listenForEvent('gps', function(args){
		if(args.person == 'nick' && args.location == 'home'){
			log.info("LISTENER: Nick has arrived home.");
			house.setStatus('nickslocation','home');
			alert("Detected that Nick has arrived home.");
		}
	});
};