// Imported Modules
var log = require('../helpers/log.js');
var request = require('request');

// Log the started schedule
log.startup("Job Scheduled");

// Define the job
module.exports = {
	schedule: '*/1 * * * *', 
	job: function(){
		var exec = require('child_process').exec;
		exec('apcaccess', function(error, stdout, stderr) {
			var status = {};
		  	var lines = stdout.split("\n");
		  	for(var i = 0; i < lines.length; i++){
		  		if(lines[i]){
		  			var stat = lines[i].split(":");
		  			status[stat[0].trim()] = stat[1].trim();
		  		}
		  	}
		  	var simpleStatus = {
		  		status: status.STATUS,
		  		startTime: status.STARTTIME,
		  		lineVoltage: status.LINEV,
		  		loadPercent: status.LOADPCT,
		  		batteryCharge: status.BCHARGE,
		  		timeLeft: status.TIMELEFT,
		  		batteryVoltage: status.BATTV,
		  		timeOnBattery: status.TONBATT
		  	};
			var conf = require('../config.js'); 
			var payload = {
				overrideUser: conf.uName,
				overridePassword: conf.password,
				event: "ups-status",
				args: simpleStatus
			};
			request.post(
			    'http://localhost/home/trigger-event',
			    {json: payload},
			    function (error, response, body) {
			        if (error) {
			            log.error("Unable to trigger ups-status event: " + error);
			        } 
			    }
			);
		});
	}
};