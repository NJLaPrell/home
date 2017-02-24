
var conf = require('../config.js');
var Log = require('./log');
var events = require('events');
var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(100);
var date = require('./date-time.js');
var fs = require('fs');
var eventRoster = require('./event-roster.js');
var Devices = require.main.require('./helpers/devices.js');

module.exports = {
	date: date,
	eventEmitter: eventEmitter,
	conf: conf,
	log: new Log(conf.debug),
	devices: null,
	listenersRegistered: {},
	pollsRegistered: {},
	servicesRegistered: {},
	jobsRegistered: {},
	eventRoster: eventRoster,
	activeEvents: {},
	status: {
		daytime: null,
		nighttime: null,
		nickslocation: null,
		brendaslocation: null,
		houseOccupied: null,
		motionLastDetected: null,
		lastRDPConnection: null,
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
		temperature: {
			office: null
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
		this.eventEmitter.emit(eventName, args);	
		this.log.debug("Event Triggered: " + eventName + " - " + JSON.stringify(args));
		if(!this.eventRoster[eventName]){
			this.log.warning("Event \"" + eventName + "\" was triggered, but is not on the Event Roster.");
		} else {
			this.eventRoster[eventName].lastTriggered = date.getDateTime();
		}
	},
	listenForEvent: function(name, event, listenerMethod){
		this.activeEvents[name] = function(args){
			listenerMethod(this, args);
		}.bind(this);
		this.eventEmitter.on(event, this.activeEvents[name]);
	},
	removeEventListener: function(name, event){
		this.eventEmitter.removeListener(event, this.activeEvents[name]);
	},
	initializeDevices: function(){
		this.devices = new Devices(this);
	},
	initializePolls: function(){
		var polls = this.getComponents('Polls');
		for(var i = 0; i < polls.length; i++){
			this.pollsRegistered[polls[i].name] = polls[i];
			this.pollsRegistered[polls[i].name].start(this);
		}
	},
	initializeListeners: function(){
		var listeners = this.getComponents('Listeners');
		for(var i = 0; i < listeners.length; i++){
			this.listenersRegistered[listeners[i].name] = listeners[i];
			this.listenersRegistered[listeners[i].name].listen(this);
		}
	},
	initializeJobs: function(){
		var jobs = this.getComponents('Jobs');
		for(var i = 0; i < jobs.length; i++){
			this.jobsRegistered[jobs[i].name] = jobs[i];
			this.jobsRegistered[jobs[i].name].scheduleJob(this);
		}
	},
	initializeServices: function(){
		var services = this.getComponents('Services');
		for(var i = 0; i < services.length; i++){
			this.servicesRegistered[services[i].name] = services[i];
			this.servicesRegistered[services[i].name].start(this);
			
		}
	},
	getComponents: function(type){
		this.log.startup("Starting " + type);
		var components = [];
		fs.readdirSync(__dirname + "/../components/" + type.toLowerCase()).forEach(function (file) {
			if (file.indexOf("._") != -1 || file.indexOf(".js") == -1){
				return;
			} 
		  	components.push(require.main.require('./components/' + type.toLowerCase() + '/' + file));
		});
		return components;
	},
	getStatusReport: function(){
		return this.status;
	},
	getDebugInfo: function(){
		return this.devices;
		return {
			status: this.status,
			listenersRegistered: this.listenersRegistered,
			pollsRegistered: this.pollsRegistered,
			jobsRegistered: this.jobsRegistered,
			servicesRegistered: this.servicesRegistered
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
	logHistory: function(text){
		var day = date.getDate();
		var time = date.getTime();
		if(!this.status.eventHistory[day]){
			this.status.eventHistory[day] = [];
		}
		this.status.eventHistory[day].push({time: time, event: text});
	},
	formatException: function(e){
		var name = e.name ? e.name + ': ' : '';
		var message = e.message ? e.message : '';
		var fileName = e.fileName ? ' in ' + e.fileName : '';
		var lineNumber = e.lineNumber ? ' on line ' + e.lineNumber : '';
		if(!name && !message && !fileName && !lineNumber){
			return JSON.stringify(e);
		} else {
			return name + message +  fileName + lineNumber;
		}
	}
};