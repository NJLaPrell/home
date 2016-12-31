// Imported Modules
var http = require('http');
var Poll = require.main.require('./helpers/poll.js');

var settings = {
	name: 'Weather',
	description: 'Uses the Open Weather Map API to get current weather every 1 minute and saves the results in the house status object to be used for sunrise/sunset calculation and display the weather on the dashboard.',
	eventsTriggered: ['poll-weather'],
	interval: '1 m',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(house){
	var url = 'http://api.openweathermap.org/data/2.5/weather?id=5318313&APPID=' + this.conf.weatherAPIKey + '&units=imperial';
	var self = this;
	http.get(url, function(res){
	    var body = '';

	    res.on('data', function(chunk){
	        body += chunk;
	    });

	    res.on('end', function(){
	        var response = JSON.parse(body);
	        var args = {
	        	description: response.weather[0].main,
	        	temp: Math.round(response.main.temp),
	        	humidity: response.main.humidity,
	        	wind: Math.round(response.wind.speed),
	        	clouds: response.clouds.all,
	        	icon: response.weather[0].icon,
	        	sunrise: response.sys.sunrise,
	        	sunset: response.sys.sunset
	        };
	        self.triggerEvent('poll-weather', args);
	    });

	    res.on('error', function(error){
	    	house.logError(error);
	    });
	});	
});

module.exports = poll;
