var Log = require.main.require('./helpers/log.js');
var conf = require.main.require('./config.js');
var date = require.main.require('./helpers/date-time.js');

function Listener(settings){
	this.log = new Log(conf.debug);

	this.name = settings.name;
	this.description = settings.description ? settings.description : null;
	this.eventsListened = settings.eventsListened ? settings.eventsListened : [];
	this.eventsFired = settings.eventsFired ? settings.eventsFired : [];
	this.listener = null;
	this.listenerMethods = {};
	this.shutdownThreshold = settings.shutdownThreshold ? settings.shutdownThreshold : 0;
	this.consecutiveExceptionCount = 0;
	this.exceptionList = [];
	this.running = null;
	this.lastTriggered = null;

	this.log.startup("     Starting Listener: " + this.name);

	return this;
}

// Go through all events registered and start listening from the house class.
Listener.prototype.listen = function(house){
	this.running = true;
	for( var event in this.listenerMethods){
		house.listenForEvent(this.name, event, this.listenerMethods[event]);	
	}
};

// Register an event to listen for
Listener.prototype.registerListener = function(event, listenerMethod){
	this.listenerMethods[event] = function(house, args){
		try {
			listenerMethod(house, args);
			this.lastTriggered = date.getDateTime();
		}
		catch (e) {
			this.handleException(house, e);
		}
	}.bind(this);
};

// Graceful exception handling
Listener.prototype.handleException = function(house, e) {
	house.log.error("Exception in Listener: " + this.name + " - " + house.formatException(e));
	this.exceptionList.push(house.date.getDateTime() + " - " + house.formatException(e));
	this.consecutiveExceptionCount++;
	if(this.shutdownThreshold !== 0 && this.shutdownThreshold < this.consecutiveExceptionCount){
		for(var event in this.listenerMethods){
			house.removeEventListener(this.name, event);
		}
		this.running=false;	
		this.startTime = null;
	} 
};

module.exports = Listener;