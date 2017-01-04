var Log = require('./log.js');

function Poll(settings){
	this.triggerEvent = require('./trigger-event.js');
	this.conf = require('../config.js');
	this.log = new Log(this.conf.debug);

	this.name = settings.name;
	this.description = settings.description ? settings.description : null;
	this.intervalString = settings.interval;
	this.executeOnStartup = settings.executeOnStartup;
	this.eventsTriggered = settings.eventsTriggered ? settings.eventsTriggered : [];
	this.lastRun = null;
	this.consecutiveExceptionCount = 0;
	this.exceptionList = [];
	this.running = null;
	this.shutdownThreshold = settings.shutdownThreshold ? settings.shutdownThreshold : 0;
	this.job = null;
	this.intervalID = null;

	// Calculate the interval in miliseconds
	var parts = settings.interval.split(" ");
	var multiplyer = parts[1] == 's' ? 1000 : parts[1] == 'm' ? 60000 : parts[1] == 'h' ? 3600000 : false;
	this.interval = parts[0] * multiplyer;

	return this;
}

Poll.prototype.setJob = function(job){
	this.job = job;
};

Poll.prototype.start = function(house){
	this.log.startup("     Polling scheduled for " + this.name + " to trigger every " + this.intervalString);
	this.running = true;
	
	// Set the execution interval
	if(this.interval){
		this.intervalID = setInterval(function(){
			this.execute(house);			
		}.bind(this), this.interval);	
	}
	
	// Execute when startup is finished if executeOnStartup is set
	if(this.executeOnStartup){
		house.listenForEvent('startup-complete',function(){
			this.execute(house);
		}.bind(this));
	}
};

Poll.prototype.execute = function(house){
	try {
		this.job(house);	
		this.consecutiveExceptionCount = 0;
		this.exceptionList = [];
		this.lastRun = house.date.getDateTime();
	}
	catch(e){
		this.handleException(house, e);
	}
};

// Log the error, add it to the list for the UI, and stop the poll if the threshold is reached.
Poll.prototype.handleException = function(house, e){
	house.log.error("Exception in Poll: " + this.name + " - " + JSON.stringify(e));
	this.exceptionList.push(house.date.getDateTime() + " - " + JSON.stringify(e));
	this.consecutiveExceptionCount++;
	if(this.shutdownThreshold !== 0 && this.shutdownThreshold < this.consecutiveExceptionCount){
		this.running=false;	
		clearInterval(this.intervalID);
	}
};

module.exports = Poll;