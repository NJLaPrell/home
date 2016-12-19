var smartplug = require('edimax-smartplug');
var log = require('./log.js');

module.exports = function(house){

	this.options = {
		timeout: house.conf.smartPlugConfig.timeout,
		username: house.conf.smartPlugConfig.username,
		password: house.conf.smartPlugConfig.password
	};

	this.plugs = house.conf.smartPlugConfig.plugs;

	this.getHost = function(name){
		for(var i = 0; i < this.plugs.length; i++){
			if(this.plugs[i].name == name){
				return this.plugs[i].host;
			}
		}
		return false;
	};

	this.getOptions = function(name){
		var opts = this.options;
		opts.name = name;
		opts.host = this.getHost(name);
		return opts;
	};

	this.toggle = function(name,state){
		if(typeof state === 'undefined'){
			var self = this;
			state = this.getState(name).then(function(state){
				smartplug.setSwitchState(!state, self.getOptions(name)).catch(function(e) {
					log.warning("Failed to get the state of switch: " + name);
				});
			});

		} else {
			state = state == 'on' ? true : false;
				smartplug.setSwitchState(state, this.getOptions(name)).catch(function(e) {
				log.warning("Failed to toggle switch " + name + " to " + state + ".");
			});
		}
		
	};

	this.turnOn = function(name){
		this.toggle(name,true);
	};

	this.turnOff = function(name){
		this.toggle(name,false);
	};

	this.getState = function(name){
		return smartplug.getSwitchState(this.getOptions(name)).then(function (state) {
    		return state;
		});
	};

	return this;

};






