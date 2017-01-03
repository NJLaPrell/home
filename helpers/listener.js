var Log = require.main.require('./helpers/log.js');
var conf = require.main.require('./config.js');

function Listener(settings){
	this.log = new Log(conf.debug);

	this.name = settings.name;
	this.description = settings.description ? settings.description : null;
	this.eventsListened = settings.eventsListened ? settings.eventsListened : [];
	this.eventsFired = settings.eventsFired ? settings.eventsFired : [];
	this.listener = null;

	this.log.startup("     Starting Listener: " + this.name);

	return this;
}

Listener.prototype.listen = function(house){
	var self = this;
	try {
		this.listener(house);
	}
	catch(e){
		house.log.error("Exception in Listener: " + self.name + " - " + JSON.stringify(e));
	}
};

Listener.prototype.setListener = function(listener){
	this.listener = listener;
};

module.exports = Listener;