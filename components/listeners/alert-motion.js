// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var alert = require.main.require("./helpers/text-alert.js");
var date = require.main.require("./helpers/date-time.js");

var settings = {
	name: 'Motion Detection',
	description: 'Uses the IP camera email heard by the email-recieved listener to determine motion detection and fire an alert if nobody is home.',
	eventsListened: ['email-received'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('email-received', function(house, args){
	if(args.subject){
		house.setStatus('motionLastDetected', date.getDateTime());
		var away = house.getStatus('nickslocation') == 'away' && house.getStatus('brendaslocation') == 'away' ? true : false;
		var motion = args.subject.indexOf('Alarm:Cam_495920') != -1 ? true : false;
		if(motion && away){
			house.log.debug("Motion detected while everyone was away.");
			if(!house.getStatus('motionWhileAway')){
				alert("Motion detected on Camera 495920");
				house.logHistory("Motion was detected when nobody was home.");	
				house.triggerEvent('motion-while-away');
			}
			house.setStatus('motionWhileAway', true);
		} else if(motion && !away){
			house.setStatus('motionWhileAway', false);
		}	
	}
});

module.exports = listener;