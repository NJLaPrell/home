var Log = require('./log.js');

function Service(settings){
	this.conf = require('../config.js');
	this.log = new Log(this.conf.debug);

	this.name = settings.name;
	this.type = settings.type;
	this.service = null;

	return this;
}

Service.prototype.setService = function(service){
	this.service = service;
};

Service.prototype.start = function(house){
	this.log.startup("     Starting service: " + this.name + ".");
	this.service(house);
};

module.exports = Service;