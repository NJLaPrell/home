var Log = require('./log.js');
var schedule = require('node-schedule');

function Job(settings){
	this.conf = require('../config.js');
	this.log = new Log(this.conf.debug);

	this.name = settings.name;
	this.schedule = settings.schedule;
	this.executeOnStartup = settings.executeOnStartup;
	this.description = settings.description ? settings.description : null;
	this.eventsTriggered = settings.eventsTriggered ? settings.eventsTriggered : [];
	this.lastRun = null;
	this.job = null;

	return this;
}

Job.prototype.setJob = function(job){
	this.job = job;
};

Job.prototype.scheduleJob = function(house){
	this.log.startup("     Job scheduled for " + this.name + ": " + this.schedule);
	var self = this;
	
	schedule.scheduleJob(self.schedule, function(){
		self.lastRun = house.date.getDateTime();
		try {
			self.job(house);
		}
		catch(e){
			house.log.error("Exception in Job: " + self.name + " - " + JSON.stringify(e));
		}
	});
	
	if(this.executeOnStartup){
		house.listenForEvent('startup-complete',function(){
			this.job(house);
			self.lastRun = house.date.getDateTime();
		}.bind(this));
	}
};

module.exports = Job;