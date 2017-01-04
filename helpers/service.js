var Log = require('./log.js');

function Service(settings){
	this.conf = require('../config.js');
	this.log = new Log(this.conf.debug);

	this.name = settings.name;
	this.description = settings.description ? settings.description : null;
	this.type = settings.type;
	this.eventsTriggered = settings.eventsTriggered ? settings.eventsTriggered : [];
	this.startTime = null;
	this.service = null;
	this.shutdownThreshold = settings.shutdownThreshold ? settings.shutdownThreshold : 0;
	this.consecutiveExceptionCount = 0;
	this.exceptionList = [];
	this.running = null;
	this.retryTime = 30000;

	return this;
}

Service.prototype.setService = function(Service){
	this.service = Service;
};

Service.prototype.start = function(house){
	this.log.startup("     Starting service: " + this.name + ".");
	

	try {
		this.service(house).start();
		this.running = true;
		this.startTime = house.date.getDateTime();
	}
	catch(e){
		this.handleException(house, e);
	}
};

Service.prototype.handleException = function(house, e) {
	house.log.error("Exception in Service: " + this.name + " - " + JSON.stringify(e));
	this.exceptionList.push(house.date.getDateTime() + " - " + JSON.stringify(e));
	this.consecutiveExceptionCount++;
	if(this.shutdownThreshold !== 0 && this.shutdownThreshold < this.consecutiveExceptionCount){
		try {
			this.service(house).stop();
			this.running=false;	
			this.startTime = null;
		}
		catch(e){
			house.log.error("Exception trying to stop service: " + this.name + " - " + JSON.stringify(e));	
			this.exceptionList.push(house.date.getDateTime() + " - " + JSON.stringify(e));
			this.consecutiveExceptionCount++;
		}
	} else {
		setTimeout(function(){
			try {
				this.start(house);
			} catch(e){
				this.handleException(house, e);
			}
		}.bind(this), this.retryTime);
	}
};

module.exports = Service;