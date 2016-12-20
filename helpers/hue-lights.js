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
		    	house.logHistory("Hue Light " + light + " was turned " + direction + ".");
		    	var hueStatus = house.getStatus('hue');
				hueStatus.lights[light].state.on = direction == 'on' ? true : false;
		    }
		});
	};

	this.setBrightness = function(light, brightness){
		var state = hue.lightState.create();
		var self = this;
		api.setLightState(light, state.bri(brightness), function(err, result){
			if(err) {
				self.house.log.error(err);
			} else {
				var friendlyBri = Math.round((brightness/2.54));
				house.logHistory("Hue Light" + light + " was set to " + friendlyBri + "%.");
				var hueStatus = house.getStatus('hue');
				hueStatus.lights[light].state.bri = brightness;
			}
		});
	};

	return this;
};