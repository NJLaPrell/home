
var api = require('edimax-smartplug');
var DeviceStatus = require.main.require('./helpers/devices/device-status.js');

module.exports = function(house, device) {
	this.status = new DeviceStatus(device);

	var properties = {
		name: device.name,
		timeout: house.conf.smartPlugConfig.timeout,
		username: house.conf.smartPlugConfig.username,
		password: house.conf.smartPlugConfig.password,
		host: device.identifyer
	};

	this.poll = function(cb){
		if(typeof cb === 'function'){cb(this.status);}
	};

	this.update = function(settings, cb) {
		/*
		api.setSwitchState(settings.on, properties).then(function(){
			this.status.on = settings.on;
			house.log.debug("Edimax switch " + this.status.name + " turned " + (settings.on ? 'on' : 'off') + ".");
			if(typeof cb === 'function'){cb(true);}
		}.bind(this)).catch(function(e) {
			house.log.warning("Failed to get the state of switch: " + this.status.name + "\rError: " + e);
			if(typeof cb === 'function'){cb(false);}
		}.bind(this));
		*/
	};

	return this;

};