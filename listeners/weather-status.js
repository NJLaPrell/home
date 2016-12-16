module.exports = function(house){
	house.listenForEvent('weather-status', function(args){
		house.recordTriggeredListener('weather-status');
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
		} else if((time < args.sunrise || time > args.sunset) && house.getStatus('daytime') === true){
			house.triggerEvent('sunset');
		// The sun just rose
		} else if((time > args.sunrise && time < args.sunset) && house.getStatus('daytime') === false){
			house.triggerEvent('sunrise');
		}
	});
};