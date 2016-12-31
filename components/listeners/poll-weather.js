// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Weather Status',
	description: 'Sets nighttime/daytime statuses on startup, updates the currentWeather status, and fires sunrise/sunset events.',
	eventsListened: ['poll-weather'],
	eventsFired: ['sunset','sunrise']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('poll-weather', function(args){
		house.recordTriggeredListener('poll-weather');
		house.setStatus('currentWeather', args);
		var date = new Date();
		var time = date.getTime()/1000;
		
		// Day/Night not yet set
		if(!house.getStatus('daytime') && !house.getStatus('nighttime')){
			if(time < args.sunrise || time > args.sunset){
				house.setStatus('daytime', false);
				house.setStatus('nighttime', true);
			} else {
				house.setStatus('daytime', true);
				house.setStatus('nighttime', false);
			}
		// The sun just set
		} else if(args.sunrise && (time < args.sunrise || time > args.sunset) && house.getStatus('daytime')){
			house.triggerEvent('sunset');
			house.log.info("SUNSET");
			house.log.info(JSON.stringify(args));
			house.log.info(time);
		// The sun just rose
		} else if(args.sunrise && (time > args.sunrise && time < args.sunset) && house.getStatus('nighttime')){
			house.triggerEvent('sunrise');
			house.log.info("SUNRISE");
			house.log.info(JSON.stringify(args));
			house.log.info(time);
		}
	});
});

module.exports = listener;