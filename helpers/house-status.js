var log = require('./log');
var events = require('events');
var eventEmitter = new events.EventEmitter();

module.exports = {
	eventEmitter: eventEmitter,
	eventsFired: [],
	listenersTriggered: [],
	listenersRegistered: [],
	status: {
		daytime: null,
		nighttime: null,
		nickslocation: null,
		brendaslocation: null,
		motionLastDetected: null
	},
	getStatus: function(status){
		if(typeof this.status[status] !== undefined){
			return this.status[status];
		} else {
			return false;
		}
	},
	setStatus: function(status, value){
		if(typeof this.status[status] == 'undefined'){
			log.warning("Setting a house status for '" + status + ",' but the status did not previously exist.");
		}
		this.status[status] = value;
	},
	triggerEvent: function(eventName, args){
		var date = new Date();
		this.eventsFired.push({"time": date.toString(), "event": eventName});
		this.eventEmitter.emit(eventName, args);	
	},
	listenForEvent: function(eventName, eventAction){
		var date = new Date();
		this.listenersRegistered.push({
			time: date.toString(),
			listener: this.getScript(),
			event: eventName
		});
		eventEmitter.on(eventName, function(args){
			eventAction(args);
		});
	},
	getStatusReport: function(){
		return this.status;
	},
	getDebugInfo: function(){
		return {
			eventsFired: this.eventsFired,
			listenersTriggered: this.listenersTriggered,
			listenersRegistered: this.listenersRegistered,
			status: this.status
		};
	},
	getScript: function(script){
		var originalFunc = Error.prepareStackTrace;
	    var callerfile;
	    try {
	        var err = new Error();
	        var currentfile;
	        Error.prepareStackTrace = function (err, stack) { return stack; };
	        currentfile = err.stack.shift().getFileName();
	        while (err.stack.length) {
	            callerfile = err.stack.shift().getFileName();
	            if(currentfile !== callerfile) break;
	        }
	    } catch (e) {}
	    Error.prepareStackTrace = originalFunc; 
	    return callerfile;
	},
	logTriggeredListener(event){
		var date = new Date();
		this.listenersTriggered.push({
			time: date.toString(),
			listener: this.getScript(),
			triggeredBy: event	
		});
	}
};