// Imported Modules
var roku = require('../helpers/roku'); 
log = require('../helpers/log.js');

// Log the started schedule
log.info("Job Scheduled");

// Define the job
module.exports = {
	schedule: '*/1 * * * *',
	job: function(){
		roku.executeCommand("ping", function(response){
			if(response.status >=200 && response.status < 400){
				log.info("Successfully pinged Roku. Returned status: " + response.status);	
			} else {
				log.error("Failed to ping Roku. Returned status: " + response.status);
			}
		});	
	}
};