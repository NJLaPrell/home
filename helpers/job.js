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
	this.shutdownThreshold = settings.shutdownThreshold ? settings.shutdownThreshold : 0;
	this.consecutiveExceptionCount = 0;
	this.exceptionList = [];
	this.running = null;
	this.scheduledJob = schedule;

	return this;
}

Job.prototype.setJob = function(job){
	this.job = job;
};

Job.prototype.scheduleJob = function(house){
	this.log.startup("     Job scheduled for " + this.name + ": " + this.schedule);
	this.running = true;
	var self = this;
	
	this.scheduledJob.scheduleJob(self.schedule, function(){
		try {
			self.job(house);
			self.lastRun = house.date.getDateTime();
		}
		catch(e){
			this.handleException(house, e);
		}
	});
	
	if(this.executeOnStartup){
		house.listenForEvent('Job - ' + this.name, 'startup-complete', function(){
			try {
				this.job(house);
				self.lastRun = house.date.getDateTime();
			}
			catch(e){
				this.handleException(house, e);	
			}
		}.bind(this));
	}
};

Job.prototype.handleException = function(house, e) {
	house.log.error("Exception in Job: " + this.name + " - " + house.formatException(e));
	this.exceptionList.push(house.date.getDateTime() + " - " + house.formatException(e));
	this.consecutiveExceptionCount++;
	if(this.shutdownThreshold !== 0 && this.shutdownThreshold < this.consecutiveExceptionCount){
		this.scheduledJob.cancel();
		this.running = false;
	}
};

module.exports = Job;