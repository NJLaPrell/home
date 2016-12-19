var conf = require('../config.js');
var smartplug = require('edimax-smartplug');
var log = require('./log.js');

module.exports = {
	options: {
		timeout: conf.smartPlugConfig.timeout,
		username: conf.smartPlugConfig.username,
		password: conf.smartPlugConfig.password
	},
	plugs: conf.smartPlugConfig.plugs,
	getHost: function(name){
		for(var i = 0; i < this.plugs.length; i++){
			if(this.plugs[i].name == name){
				return this.plugs[i].host;
			}
		}
		return false;
	},
	getOptions: function(name){
		var opts = this.options;
		opts.name = name;
		opts.host = this.getHost(name);
		return opts;
	},
	toggle: function(name,state){
		if(typeof state === 'undefined'){
			var self = this;
			state = this.getState(name).then(function(state){
				smartplug.setSwitchState(!state, self.getOptions(name));
			});

		} else {
			state = state == 'on' ? true : false;
				smartplug.setSwitchState(state, this.getOptions(name)).catch(function(e) {
				log.warning("Failed to toggle switch " + name + " to " + state + ".");
			});
		}
		
	},
	turnOn: function(name){
		this.toggle(name,true);
	},
	turnOff: function(name){
		this.toggle(name,false);
	},
	getState: function(name){
		return smartplug.getSwitchState(this.getOptions(name)).then(function (state) {
    		return state;
		}).catch(function(e) {
			log.warning("Failed to get the state of switch: " + name);
		});
	}

};






