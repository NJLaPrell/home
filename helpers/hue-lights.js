var conf = require('../config');
var hue = require("node-hue-api");
var api = new hue.HueApi(conf.hueHost,conf.hueUsername);

module.exports = function(house) {

	this.getState = function(){
		return api.getFullState().then(function(result){
			return result;
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
		    }
		});
	};

	return this;
};