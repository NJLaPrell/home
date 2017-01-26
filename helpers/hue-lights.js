var conf = require('../config');
var hue = require("node-hue-api");
var api = new hue.HueApi(conf.hueHost,conf.hueUsername);

module.exports = function(house) {

	this.getState = function(){
		return api.getFullState().then(function(result){
			return result;
		});
	};

	this.getLightState = function(lightID){
		return api.lightStatus(lightID).then(function(result){
			return result;
		});
	};

	this.getAllLightStates = function(){
		// To support colors, we have to retrieve the light states, then re-retrieve light states with RGB 
		// only for lights that support it.
		return api.lights().then(function(ret){
			lights = {};
			var colorLights = [];
			var idMap = [];
			for(var i = 0; i < ret.lights.length; i++){
				if(ret.lights[i].type == 'Extended color light'){
					colorLights.push(api.lightStatusWithRGB(ret.lights[i].id));	
					idMap.push(ret.lights[i].id);
				} else {
					lights[ret.lights[i].id] = ret.lights[i];
				}
			}
			return Promise.all(colorLights).then(function(res, error){
				for(var i = 0; i < res.length; i++){
					lights[idMap[i]] = res[i];
				}
				return lights;
			});
		});	
	};

	this.turnOn = function(light){
		this.toggleState(light, 'on');
	};

	this.turnOff = function(light){
		this.toggleState(light, 'off');
	};

	this.toggleState = function(light, direction){
		if(!direction){
			//TODO: Get current state
			direction = 'on';
		}
		var state = hue.lightState.create();
		state = direction == 'on' ? state.on() : state.off();
		var self = this;
		api.setLightState(light, state, function(err, result) {
		    if (err) {
		    	self.house.log.error(err);
		    } else {
		    	house.log.debug("Hue Light " + light + " was turned " + direction + ".");
		    	var hueStatus = house.getStatus('hue');
				hueStatus.lights[light].state.on = direction == 'on' ? true : false;
				house.setStatus('hue', hueStatus);
				house.triggerEvent('hue-toggled', {lightID: light, direction: direction});
		    }
		});
	};

	this.setBrightness = function(light, brightness){
		var state = hue.lightState.create();
		var self = this;
		var newState = brightness > 0 ? state.on().bri(brightness) : state.off();
		api.setLightState(light, newState, function(err, result){
			if(err) {
				self.house.log.error(err);
			} else {
				var friendlyBri = Math.round((brightness/2.54));
				house.log.debug("Hue Light" + light + " was set to " + friendlyBri + "%.");
				var hueStatus = house.getStatus('hue');
				hueStatus.lights[light].state.bri = brightness;
				house.setStatus('hue', hueStatus);
				house.triggerEvent('hue-brightness-changed', {lightID: light, bri: brightness});
			}
		});
	};

	this.setRGB = function(light, rgb){
		var state = hue.lightState.create();
		var self = this;
		api.setLightState(light, state.rgb(rgb), function(err, result){
			if(err) {
				self.house.log.error(err);
			} else {
				var friendlyRGB = 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
				house.log.debug("Hue Light" + light + " was set to " + friendlyRGB + ".");
				var hueStatus = house.getStatus('hue');
				hueStatus.lights[light].state.rgb = rgb;
				house.setStatus('hue', hueStatus);
				house.triggerEvent('hue-color-changed', {lightID: light, rgb: rgb});
			}
		});
	};

	this.setScene = function(scene){
		switch(scene){
			case "dim":
				var colorLampState = hue.lightState.create();
				colorLampState = colorLampState.on().bri(170).hue(7170).sat(241).xy(0.537, 0.4159).ct(500);
				var lampState = hue.lightState.create();
				lampState = lampState.off();
				api.setLightState(1, colorLampState, function(err, result){
					this.house.log.error(err);
				}.bind(this));
				api.setLightState(3, colorLampState, function(err, result){
					this.house.log.error(err);
				}.bind(this));
				api.setLightState(4, lampState, function(err, result){
					this.house.log.error(err);
				}.bind(this));

			break;

			case "daytime":
				var colorLampState = hue.lightState.create();
				colorLampState = colorLampState.on().bri(255).hue(8402).sat(140).xy(0.4575, 0.4099).ct(366);
				var lampState = hue.lightState.create();
				lampState = lampState.on().bri(254);
				api.setLightState(1, colorLampState, function(err, result){
					this.house.log.error(err);
				}.bind(this));
				api.setLightState(3, colorLampState, function(err, result){
					this.house.log.error(err);
				}.bind(this));
				api.setLightState(4, lampState, function(err, result){
					this.house.log.error(err);
				}.bind(this));
			break;
		}
	};

	return this;
};