var smartplug = require('edimax-smartplug');

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
				var plugs = house.getStatus('plugs');
				plugs[name] = !state
				house.setStatus('plugs', plugs);
				smartplug.setSwitchState(!state, self.getOptions(name)).then(function(){
					house.log.debug("Edimax switch " + name + " turned " + (state ? 'off' : 'on') + ".");
				}).catch(function(e) {
					house.log.warning("Failed to get the state of switch: " + name + "\rError: " + e);
					var plugs = house.getStatus('plugs');
					plugs[name] = state
					house.setStatus('plugs', plugs);
				});
			});

		} else {
			state = state == 'on' ? true : false;
			var plugs = house.getStatus('plugs');
			plugs[name] = state
			house.setStatus('plugs', plugs);
			smartplug.setSwitchState(state, this.getOptions(name)).then(function(){
				house.log.debug("Edimax switch " + name + " turned " + (state ? 'on' : 'off') + ".");
			}).catch(function(e) {
				house.log.warning("Failed to toggle switch " + name + " to " + state + ".\rError " + e);
				var plugs = house.getStatus('plugs');
				plugs[name] = !state
				house.setStatus('plugs', plugs);
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






