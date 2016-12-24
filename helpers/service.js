var Log = require('./log.js');

function Service(settings){
	this.conf = require('../config.js');
	this.log = new Log(this.conf.debug);

	this.name = settings.name;
	this.description = settings.description ? settings.description : null;
	this.type = settings.type;
	this.eventsTriggered = settings.eventsTriggered ? settings.eventsTriggered : [],
	this.startTime = null;
	this.service = null;

	return this;
}

Service.prototype.setService = function(service){
	this.service = service;
};

Service.prototype.start = function(house){
	this.log.startup("     Starting service: " + this.name + ".");
	this.startTime = house.date.getDateTime();
	this.service(house);
};

module.exports = Service;