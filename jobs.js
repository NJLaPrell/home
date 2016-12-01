var schedule = require('node-schedule');
var roku = require('./helpers/roku'); 


var log = function(msg, type, job){
	var currentDate = new Date();
	console.log(currentDate.toString() + " - " + type + ": " + job + "\r\n" + msg + "\r\n\r\n");
};

log("Started the job process.", "INFO", "jobs.js");

var j1 = schedule.scheduleJob('*/1 * * * *', function(){
  
	roku.executeCommand("ping", function(response){
		if(response.status >=200 && response.status < 400){
			log("Successfully pinged Roku. Returned status: " + response.status, "INFO", "Ping Roku");	
		} else {
			log("Failed to ping Roku. Returned status: " + response.status, "ERROR", "Ping Roku");
		}
	});
});

var j2 = schedule.scheduleJob('*/5 * * * *', function(){
	roku.getPowerStatus(function(power){
		if(!power){
			roku.executeCommand("wake", function(response){
				if(response.status >=200 && response.status < 400){
					log("Found Roku powered off. Successfully woke it up.", "INFO", "Wake Roku");	
				} else {
					log("Found Roku powered off. Can't wake it. He's dead, Jim.", "ERROR", "Wake Roku");
				}	
			});
		}
	});
});