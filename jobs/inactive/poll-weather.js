// Imported Modules
var log = require('../helpers/log.js');
var triggerEvent = require('../helpers/trigger-event.js');
var http = require('http');
var conf = require('../config.js');
// Log the started schedule
log.startup("Job Scheduled");

// Define the job
module.exports = {
	schedule: '*/1 * * * *', 
	job: function(){

		var url = 'http://api.openweathermap.org/data/2.5/weather?id=5318313&APPID=' + conf.weatherAPIKey + '&units=imperial';
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
		        	icon: response.weather[0].icon
		        };
		        triggerEvent('weather-status', args);
		    });
		}).on('error', function(e){
		      console.log("Got an error: ", e);
		});	
	}
};