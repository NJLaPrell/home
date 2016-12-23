
var conf = require('../config.js');
var Log = require('./log');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var date = require('./date-time.js');
var fs = require('fs');

module.exports = {
	eventEmitter: eventEmitter,
	conf: conf,
	log: new Log(conf.debug),
	eventsFired: [],
	listenersTriggered: [],
	listenersRegistered: [],
	pollsRegistered: {},
	lutron: null,
	status: {
		daytime: null,
		nighttime: null,
		nickslocation: null,
		brendaslocation: null,
		motionLastDetected: null,
		powered: null,
		powerOutSince: null,
		internetAccess: null,
		internetOutSince: null,
		upsStatus: null,
		tvStatus: null,
		currentWeather: {
			description: null,
			temp: null,
			humidity: null,
			wind: null,
			clouds: null,
			icon: null
		},
		eventHistory: {},
		motionWhileAway: false,
		plugs: {},
		hue: {},
		caseta: {
			dimmers: conf.lutron.dimmers
		}
	},
	colorPreset: {
		red: [255, 0, 0],
		yellow: [255, 149, 36],
		green: [0, 255, 0],
		blue: [49, 158, 255],
		white: [255, 255, 255],
		orange: [255, 152, 37],
		purple: [255, 107, 211],
		warm: [255, 209, 157],
		cold: [207, 239, 255]
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
			this.log.warning("Setting a house status for '" + status + ",' but the status did not previously exist.");
		}
		this.status[status] = value;
	},
	triggerEvent: function(eventName, args){
		this.eventsFired.push({"time": date.getDateTime(), "event": eventName});
		this.eventEmitter.emit(eventName, args);	
		this.log.debug("Event Triggered: " + eventName + " - " + JSON.stringify(args));
	},
	listenForEvent: function(eventName, eventAction){
		this.listenersRegistered.push({
			time: date.getDateTime(),
			listener: this.getScript(),
			event: eventName
		});
		eventEmitter.on(eventName, function(args){
			eventAction(args);
		});
	},
	initializePolls: function(){
		this.log.startup("Registering Polls");
		fs.readdirSync(__dirname + "/../polls").forEach(function (file) {
		  if (file == 'index.js' || file.split("._").length > 1 || fs.lstatSync(__dirname + "/../polls/" + file).isDirectory()) return;
		  	var poll = require('../polls/' + file);
		  	this.startPoll(poll);
		}.bind(this));
	},
	startPoll: function(poll){
		this.pollsRegistered[poll.name] = poll;
		poll.execute(this);
	},
	initializeListeners: function(){
		this.log.startup("Registering Listeners");
		fs.readdirSync(__dirname + "/../listeners").forEach(function (file) {
		  if (file == 'index.js' || file.split("._").length > 1 || fs.lstatSync(__dirname + "/../listeners/" + file).isDirectory()) return;
		  	var listener = require('../listeners/' + file);
		  	this.startListener(listener);
		}.bind(this));
	},
	startListener: function(listener){
		listener.listen(this);
	},
	initializeJobs: function(){
		this.log.startup("Registering Jobs");
		fs.readdirSync(__dirname + "/../jobs").forEach(function (file) {
		  if (file == 'index.js' || file.split("._").length > 1 || fs.lstatSync(__dirname + "/../jobs/" + file).isDirectory()) return;
		  	var job = require('../jobs/' + file);
		  	this.startJob(job);
		}.bind(this));
	},
	startJob: function(job){
		job.scheduleJob(this);
	},
	getStatusReport: function(){
		return this.status;
	},
	getDebugInfo: function(){
		return {
			status: this.status,
			eventsFired: this.eventsFired,
			listenersTriggered: this.listenersTriggered,
			listenersRegistered: this.listenersRegistered,
			pollsRegistered: Object.keys(this.pollsRegistered)
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
	recordTriggeredListener: function(event){
		this.listenersTriggered.push({
			time: date.getDateTime(),
			listener: this.getScript(),
			triggeredBy: event	
		});
		this.trimDebugHistory();
	},
	trimDebugHistory: function(){
		if(this.listenersTriggered.length > this.conf.maxDebugHistory || this.eventsFired.length > this.conf.maxDebugHistory){
			if(this.listenersTriggered.length > this.conf.minDebugHistory){
				this.listenersTriggered.splice(0,(this.listenersTriggered.length - this.conf.minDebugHistory));
			}
			if(this.eventsFired.length > this.conf.minDebugHistory){
				this.eventsFired.splice(0,(this.eventsFired.length - this.conf.minDebugHistory));
			}
		}
	},
	logHistory: function(text){
		var day = date.getDate();
		var time = date.getTime();
		if(!this.status.eventHistory[day]){
			this.status.eventHistory[day] = [];
		}
		this.status.eventHistory[day].push({time: time, event: text});
	}
};