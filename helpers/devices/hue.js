
var hue = require("node-hue-api");
var DeviceStatus = require.main.require('./helpers/devices/device-status.js');

module.exports = function(house, device) {
	this.status = new DeviceStatus(device);
	this.type = 'hue';
	var api = new hue.HueApi(house.conf.deviceConfig.hue.host, house.conf.deviceConfig.hue.username);
	var properties = {
		name: device.name,
		host: device.identifyer
	};

	this.poll = function(cb){
		api.lightStatus(properties.host).then(function(result){
			this.setStatus(result);
			if(typeof cb === 'function'){cb(this.status);}
		}.bind(this)).catch(function(err){
			house.log.error(err);
			if(typeof cb === 'function'){cb(false);}
		}.bind(this));
	};

	this.update = function(settings, cb) {
		var state = hue.lightState.create();
		var newState = settings.on === false ? state.off() : state.on();
		if(typeof settings.brightness !== 'undefined'){
			newState = newState.bri(settings.brightness * 2.24);
		}
		if(typeof settings.rgb !== 'undefined'){
			newState = newState.rgb(settings.rgb);
		}
		if(typeof settings.hue !== 'undefined'){
			newState = newState.hue(settings.hue);
		}
		if(typeof settings.sat !== 'undefined'){
			newState = newState.sat(settings.sat);
		}
		if(typeof settings.xy !== 'undefined'){
			newState = newState.xy(settings.xy);
		}
		if(typeof settings.ct !== 'undefined'){
			newState = newState.ct(settings.ct);
		}
		api.setLightState(properties.host, newState, function(err, result){
			if(err) {
				this.house.log.error(err);
				if(typeof cb === 'function'){cb(false);}
			} else {
				for(var i in settings){
					this.status[i] = settings[i];
				}
				if(typeof cb === 'function'){cb(true);}
			}
		}.bind(this));
	};

	this.setStatus = function(status){
		this.status.on = status.state.on;
		this.status.brightness = status.state.bri != null ? (status.state.bri/2.54) : null;
		this.status.brightness = !status.state.on ? 0 : this.status.brightness;
		this.status.hue = status.state.hue ? status.state.hue : null;
		this.status.sat = status.state.sat ? status.state.sat : null;
		this.status.xy = status.state.xy ? status.state.xy : null;
		this.status.ct = status.state.ct ? status.state.ct : null;
	};

	setInterval(function() {
		this.poll();
	}.bind(this), 5000);

	return this;

};