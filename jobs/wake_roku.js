// Imported Modules
var roku = require('../helpers/roku'); 
log = require('../helpers/log.js');

// Log the started schedule
log.startup("Job Scheduled");

// Define the job
module.exports = {
	schedule: '*/5 * * * *', 
	job: function(){
		roku.getPowerStatus(function(power){
			if(!power){
				roku.executeCommand("wake", function(response){
					if(response.status >=200 && response.status < 400){
						log.info("Found Roku powered off. Successfully woke it up.");	
					} else {
						log.warning("Found Roku powered off. Can't wake it. He's dead, Jim.");
					}	
				});
			}
		});
	}
};