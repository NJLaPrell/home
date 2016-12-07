var alert = require("../helpers/text-alert.js");
var log = require("../helpers/log");

module.exports = function(house){
	house.listenForEvent('email-received', function(args){
		house.logTriggeredListener('email-received');
		var date = new Date();
		house.setStatus('motionLastDetected', date.toString());
		if(args.subject.indexOf('Alarm:Cam_495920') != -1 && house.getStatus('nickslocation') == 'away'){
			alert("Motion detected on Camera 495920");
		}		
	});
};