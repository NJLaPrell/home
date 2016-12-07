var alert = require("../helpers/text-alert.js");

module.exports = function(house){
	house.listenForEvent('gps', function(args){
		house.recordTriggeredListener('gps');
		if(args.person == 'nick' && args.location == 'home'){
			house.setStatus('nickslocation','home');
			alert("Detected that Nick has arrived home.");
		}
	});
};