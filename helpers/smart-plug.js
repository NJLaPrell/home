var conf = require('../config.js');
var smartplug = require('edimax-smartplug');

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
			state = !this.getState(name);
		}
		smartplug.setSwitchState(state, this.getOptions(name)).catch(function(e) {
			console.log("Request failed: ", e);
		});
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
			console.log("Request failed: ", e);
		});
	}

};






