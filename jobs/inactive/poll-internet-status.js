// Imported Modules
var request = require('request');
var roku = require('../helpers/roku');
var log = require('../helpers/log.js');
var ping = require('ping');
var triggerEvent = require('../helpers/trigger-event.js');

// Log the started schedule
log.startup("Job Scheduled");

// Define the job
module.exports = {
	schedule: '*/1 * * * *', 
	job: function(){
		ping.sys.probe("8.8.8.8", function(isAlive){
			triggerEvent('internetCheck', {pass:isAlive});
		});
	}
};