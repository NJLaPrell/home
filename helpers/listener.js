
function Listener(settings){
	this.log = require('./log.js');

	this.name = settings.name;
	this.eventsListened = settings.eventsListened ? settings.eventsListened : [];
	this.eventsFired = settings.eventsFire ? settings.eventsFired : [];
	this.listener = null;

	this.log.startup("     Starting Listener: " + this.name);

	return this;
}

Listener.prototype.listen = function(house){
	this.listener(house);
};

Listener.prototype.setListener = function(listener){
	this.listener = listener;
};

module.exports = Listener;