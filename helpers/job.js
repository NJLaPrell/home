var Log = require('./log.js');
var schedule = require('node-schedule');

function Job(settings){
	this.conf = require('../config.js');
	this.log = new Log(this.conf.debug);

	this.name = settings.name;
	this.schedule = settings.schedule;
	this.executeOnStartup = settings.executeOnStartup;
	this.job = null;

	return this;
}

Job.prototype.setJob = function(job){
	this.job = job;
};

Job.prototype.scheduleJob = function(house){
	this.log.startup("     Job scheduled for " + this.name + ": " + this.schedule);
	var self = this;
	
	schedule.scheduleJob(self.schedule, function(){self.job(house)});
	
	if(this.executeOnStartup){
		this.job(house);
	}
};

module.exports = Job;