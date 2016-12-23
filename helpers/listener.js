var Log = require.main.require('./helpers/log.js');
var conf = require.main.require('./config.js');

function Listener(settings){
	this.log = new Log(conf.debug);

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