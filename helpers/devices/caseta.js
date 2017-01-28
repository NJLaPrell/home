var DeviceStatus = require.main.require('./helpers/devices/device-status.js');

module.exports = function(house, device, api) {
	this.status = new DeviceStatus(device);

	var properties = {
		name: device.name,
		host: device.identifyer
	};

	this.poll = function(cb){
		var self = this;
		var pollHandler = function(args){
			if(args.deviceID == properties.host){
				self.status.on = args.brightness > 0 ? true : false;
				self.status.brightness = args.brightness;
				house.eventEmitter.removeListener('lutron-changed', pollHandler)
				if(typeof cb === 'function'){cb(self.status);}
			}
		};
		house.eventEmitter.on('lutron-changed', pollHandler)
		api.pollDeviceStatus(properties.host);
	};

	this.update = function(settings, cb) {
		var self = this;
		var brightness = 0;
		if(settings.on){
			brightness = 100;
		}
		if(settings.brightness){
			brightness = settings.brightness;
		}
		api.setBrightness(properties.host, brightness, cb(true));
	};

	// Keep status in sync
	house.eventEmitter.on('lutron-changed', function(args){
		this.status.on = args.brightness > 0 ? true : false;
		this.brightness = args.brightness;	
	}.bind(this));

	return this;

};