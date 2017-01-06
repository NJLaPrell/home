// Imported Modules
var Service = require.main.require('./helpers/service.js');
var Wemo = require('wemo-client');

var settings = {
	name: 'Wemo',
	type: 'TCP/IP',
	eventsTriggered: ['wemo-changed', 'wemo-discovered'],
	description: 'Listens for wemo devices',
	shutdownThreshold: 10
};

var service = new Service(settings);

service.setService(function(house){
	this.wemo = null;

	this.device = {};
	
	this.start = function(){
		this.wemo = new Wemo();
		this.wemo.discover(function(deviceInfo) {

			house.triggerEvent('wemo-discovered', {device:deviceInfo.friendlyName, info:deviceInfo});

		    // Get the client for the found device
			this.device[deviceInfo.friendlyName] = this.wemo.client(deviceInfo);

			// Handle BinaryState events
			this.device[deviceInfo.friendlyName].on('binaryState', function(value) {
			  house.triggerEvent('wemo-changed', {device:deviceInfo.friendlyName, value:value});
			}.bind(this));

		}.bind(this));
		
	};

	this.stop = function(){
		this.wemo = null;
		this.device = {};
	};
	return this;
});

module.exports = service;