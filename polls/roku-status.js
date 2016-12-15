// Imported Modules
var Poll = require('../helpers/poll.js');
var roku = require('../helpers/roku'); 

var settings = {
	name: 'Roku Status',
	interval: '1 m',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(){
	var self = this;
	roku.getPowerStatus(function(power){
		if(!power){
			self.triggerEvent('tv-status', {status:'off'});
		} else {
			roku.getScreenSaverMode(function(screensaver){
				if(!screensaver){
					self.triggerEvent('tv-status', {status:'on'});
				} else {
					self.triggerEvent('tv-status', {status:'sleeping'});
				}
			});
		}
	});	
});

module.exports = poll;