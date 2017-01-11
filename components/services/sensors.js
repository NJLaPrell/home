// Imported Modules
var Service = require.main.require('./helpers/service.js');
var SensorMonitor = require.main.require('./helpers/sensor-monitor.js');

var settings = {
	name: 'Sensor Monitor',
	type: 'Telnet',
	eventsTriggered: ['sensor-monitor-started','sensor-connected', 'sensor-reported', 'sensor-offline', 'sensor-monitor-stopped'],
	eventsListened: ['sensor-connected','sensor-offline'],
	description: '...',
	shutdownThreshold: 10
};

var service = new Service(settings);

service.setService(function(house){
	this.sensorMonitor = false;
	
	this.start = function(){
		if(!this.sensorMonitor){
			this.sensorMonitor = new SensorMonitor(house);
		}
		this.sensorMonitor.start();		
	};

	this.stop = function(){
		this.sensorMonitor.disconnect();
	};
	return this;
});

module.exports = service;