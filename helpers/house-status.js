var log = require('./log');
var events = require('events');
var eventEmitter = new events.EventEmitter();

module.exports = {
	eventEmitter: eventEmitter,
	status: {
		daytime: null,
		nighttime: null,
		nickslocation: null,
		brendaslocation: null
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
		log.info("triggering event:" + eventName);
		log.info(args);
		this.eventEmitter.emit(eventName, args);	
	},
	listenForEvent: function(eventName, eventAction){
		eventEmitter.on(eventName, function(args){
			eventAction(args);
		});
	},
	getStatusReport: function(){
		return this.status;
	}
};