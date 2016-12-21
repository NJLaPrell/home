// Imported Modules
var Listener = require('../helpers/listener.js');
var alert = require("../helpers/text-alert.js");
var date = require("../helpers/date-time.js");

var settings = {
	name: 'Motion Detection',
	eventsListened: ['email-received']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('email-received', function(args){
		house.recordTriggeredListener('email-received');
		house.setStatus('motionLastDetected', date.getDateTime());

		var away = house.getStatus('nickslocation') == 'away' && house.getStatus('brendaslocation') == 'away' ? true : false;
		var motion = args.subject.indexOf('Alarm:Cam_495920') != -1 ? true : false;
		if(motion && away){
			house.log.debug("Motion detected while everyone was away.");
			if(!house.getStatus('motionWhileAway')){
				alert("Motion detected on Camera 495920");
				house.logHistory("Motion was detected when nobody was home.");	
			}
			house.setStatus('motionWhileAway', true);
		} else if(motion && !away){
			house.setStatus('motionWhileAway', false);
		}	
	});
});

module.exports = listener;