var Log = require('./log.js');

function Poll(settings){
	this.triggerEvent = require('./trigger-event.js');
	this.conf = require('../config.js');
	this.log = new Log(this.conf.debug);

	this.name = settings.name;
	this.description = settings.description ? settings.description : null;
	this.intervalString = settings.interval;
	this.executeOnStartup = settings.executeOnStartup;
	this.eventsTriggered = settings.eventsTriggered ? settings.eventsTriggered : [],
	this.lastRun = null;
	this.job = null;

	var parts = settings.interval.split(" ");
	var multiplyer = parts[1] == 's' ? 1000 : parts[1] == 'm' ? 60000 : parts[1] == 'h' ? 3600000 : false;

	this.interval = parts[0] * multiplyer;

	return this;
}

Poll.prototype.setJob = function(job){
	this.job = job;
};

Poll.prototype.execute = function(house){
	this.log.startup("     Polling scheduled for " + this.name + " to trigger every " + this.intervalString);
	var self = this;
	
	if(this.interval){
		setInterval(function(){
			self.job(house);
			self.lastRun = house.date.getDateTime();
		}, this.interval);	
	}
	
	if(this.executeOnStartup){
		house.listenForEvent('startup-complete',function(){
			this.job(house);
			self.lastRun = house.date.getDateTime();
		}.bind(this));
	}
};

module.exports = Poll;