var alert = require("../helpers/text-alert.js");

module.exports = function(house){
	house.listenForEvent('email-received', function(args){
		house.recordTriggeredListener('email-received');
		var date = new Date();
		house.setStatus('motionLastDetected', date.toString());
		if(args.subject.indexOf('Alarm:Cam_495920') != -1 && house.getStatus('nickslocation') == 'away' && house.getStatus('brendaslocation') == 'away'){
			alert("Motion detected on Camera 495920");
		}		
	});
};