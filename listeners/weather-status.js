module.exports = function(house){
	house.listenForEvent('weather-status', function(args){
		house.recordTriggeredListener('weather-status');
		house.setStatus('currentWeather', args);
		
		// Day/Night not yet set
		if(!house.getStatus('daytime') && !house.getStatus('nighttime')){
			var date = new Date();
			var time = date.getTime()/1000;
			if(time < args.sunrise || time > args.sunset){
				house.setStatus('daytime', false);
				house.setStatus('nighttime', true);
			} else {
				house.setStatus('daytime', true);
				house.setStatus('nighttime', false);
			}
		}
	});
};