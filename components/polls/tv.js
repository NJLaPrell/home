// Imported Modules
var Poll = require.main.require('./helpers/poll.js');
var roku = require.main.require('./helpers/roku'); 

var settings = {
	name: 'Roku Status',
	description: 'Checks the TV every minute and turns it on to the blank screen if the power is off in order to prevent it from becoming unreachable.',
	interval: '1 m',
	eventsTriggered: ['poll-tv'],
	executeOnStartup: true,
	shutdownThreshold: 10
};

var poll = new Poll(settings);

poll.setJob(function(){
	var self = this;
	roku.getPowerStatus(function(power){
		if(!power){
			self.triggerEvent('poll-tv', {status:'off'});
		} else {
			roku.getScreenSaverMode(function(screensaver){
				if(!screensaver){
					self.triggerEvent('poll-tv', {status:'on'});
				} else {
					self.triggerEvent('poll-tv', {status:'sleeping'});
				}
			});
		}
	});	
});

module.exports = poll;