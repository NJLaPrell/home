var log = require("../helpers/log.js");
var alert = require("../helpers/text-alert.js");

module.exports = function(house){
	house.listenForEvent('gps', function(args){
		house.logTriggeredListener('gps');
		if(args.person == 'nick' && args.location == 'home'){
			house.setStatus('nickslocation','home');
			alert("Detected that Nick has arrived home.");
		}
	});
};