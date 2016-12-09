// Imported Modules
var request = require('request');
var roku = require('../helpers/roku');
var log = require('../helpers/log.js');
var ping = require('ping');

// Log the started schedule
log.startup("Job Scheduled");

// Define the job
module.exports = {
	schedule: '*/1 * * * *', 
	job: function(){

		var ops = {
			host: "www.google.com",
			timeout: 1000,
			method: "GET",
			path: "/"
		};
		var http = require('http');
		
		var triggerEvent = function(result){
			var conf = require('../config.js'); 
			var payload = {
				overrideUser: conf.uName,
				overridePassword: conf.password,
				event: "internetCheck",
				args: {
					pass: result
				}
			};
			request.post(
			    'http://localhost/home/trigger-event',
			    {json: payload},
			    function (error, response, body) {
			        if (error) {
			            log.error("Unable to trigger ineternetCheck event: " + error);
			        } 
			    }
			);
		};
		ping.sys.probe("8.8.8.8", function(isAlive){
			triggerEvent(isAlive);
		});
	}
};