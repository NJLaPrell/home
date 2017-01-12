// Required Modules
var events = require('events');
var net = require('net');
var date = require.main.require('./helpers/date-time.js');
var Sensor = require.main.require('./helpers/sensor.js');

module.exports = function(house){
	this.monitor = null;
	this.sensors = [];
	this.sensorsAvailable = house.conf.sensors;
	
	house.triggerEvent('sensor-monitor-started');

	this.start = function(){
		for(var sensorID in this.sensorsAvailable){
			this.sensors[sensorID] = new Sensor(sensorID, house);
			this.sensors[sensorID].connect();
		}
	};

	this.stop = function(){
		for(var sensorID in this.sensors){
			this.sensors[sensorID].stop();
		}
		house.triggerEvent('sensor-monitor-stopped');
	};

	return this;

};

