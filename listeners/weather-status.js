module.exports = function(house){
	house.listenForEvent('weather-status', function(args){
		house.recordTriggeredListener('weather-status');
		house.setStatus('currentWeather', args);
	});
};