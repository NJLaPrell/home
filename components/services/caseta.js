// Imported Modules
var Service = require.main.require('./helpers/service.js');
var Lutron = require.main.require('./helpers/lutron.js');

var settings = {
	name: 'Lutron Caseta Hub',
	type: 'Telnet',
	description: 'Listens to the Lutron Caseta Hub and issues commands sent by the trigger while updating house status with broadcasts from the hub.',
	shutdownThreshold: 10
};

var service = new Service(settings);

service.setService(function(house){
	this.lutron = false;
	
	this.start = function(){
		if(!this.lutron){
			this.lutron = new Lutron(house);
		}
		this.lutron.connect();
	};

	this.stop = function(){
		this.lutron.disconnect();
	};
	return this;
});

module.exports = service;