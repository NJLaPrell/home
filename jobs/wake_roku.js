// Imported Modules
var roku = require('../helpers/roku'); 

// Define the job
module.exports = function(house){
	house.log.startup("Job Scheduled");
	this.schedule = '*/5 * * * *';
	this.job = function(house){
		roku.getPowerStatus(function(power){
			if(!power){
				roku.executeCommand("wake", function(response){
					if(response.status >=200 && response.status < 400){
						house.log.info("Found Roku powered off. Successfully woke it up.");	
					} else {
						house.log.warning("Found Roku powered off. Can't wake it. He's dead, Jim.");
					}	
				});
			}
		});
	};
	return this;
};