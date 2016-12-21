var Log = require('./log.js');

function Poll(settings){
	this.triggerEvent = require('./trigger-event.js');
	this.conf = require('../config.js');
	this.log = new Log(this.conf.debug);

	this.name = settings.name;
	this.intervalString = settings.interval;
	this.executeOnStartup = settings.executeOnStartup;
	this.job = null;

	var parts = settings.interval.split(" ");
	if(parts.length != 2){
		this.log.error("Invalid timer format. Received: " + settings.interval);
		return false;
	}
	/*
	if(!parseInt(parts[0] > 0)){
		this.log.error("BInvalid timer format. Received: " + settings.interval);
		return false;
	}
	*/
	var multiplyer = parts[1] == 's' ? 1000 : parts[1] == 'm' ? 60000 : parts[1] == 'h' ? 3600000 : false;
	if(!multiplyer){
		this.log.error("Invalid timer format. Received: " + settings.interval);
		return false;
	}
	this.interval = parts[0] * multiplyer;
	return this;
}

Poll.prototype.setJob = function(job){
	this.job = job;
};

Poll.prototype.execute = function(house){
	this.log.startup("     Polling scheduled for " + this.name + " to trigger every " + this.intervalString);
	var self = this;
	setInterval(function(){self.job(house);}, this.interval);
	if(this.executeOnStartup){
		this.job(house);
	}
};

module.exports = Poll;