// Imported Modules
var roku = require('../helpers/roku'); 
log = require('../helpers/log.js');
var triggerEvent = require('../helpers/trigger-event.js');

// Log the started schedule
log.startup("Job Scheduled");

// Define the job
module.exports = {
	schedule: '*/1 * * * *',
	job: function(){
		roku.getPowerStatus(function(power){
			if(!power){
				triggerEvent('tv-status', {status:'off'});
			} else {
				roku.getScreenSaverMode(function(screensaver){
					if(!screensaver){
						triggerEvent('tv-status', {status:'on'});
					} else {
						triggerEvent('tv-status', {status:'sleeping'});
					}
				});
			}
		});	
	}
};