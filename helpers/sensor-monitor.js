// Required Modules
var events = require('events');
var net = require('net');
var date = require.main.require('./helpers/date-time.js');

module.exports = function(house){
	this.monitor = null;
	this.sensors = [];
	this.sensorsAvailable = house.conf.sensors;
	
	house.triggerEvent('sensor-monitor-started');

	this.connectSensor = function(sensorID){
		if(!this.sensorsAvailable[sensorID]){
			throw {message: "Attempted to connect to sensor with the ID: " + sensorID + " but it does not exist in the config."};
		}
		this.sensors[sensorID] = this.sensorsAvailable[sensorID];
		this.sensors[sensorID].monitor = net.connect(23, this.sensors[sensorID].host);
		this.sensors[sensorID].history = [];
		this.sensors[sensorID].value = null;
		this.sensors[sensorID].avg = null;
		this.sensors[sensorID].buffer = '';
		house.triggerEvent('sensor-connected', {sensorID: sensorID});

/*
		this.sensors[sensorID].ping = setInterval(function(){
			console.log("ping");
			console.log(this.sensors[sensorID].monitor.write("1"));
		}.bind(this), 10000);
*/
		// Handle Errors
		this.sensors[sensorID].monitor.on('error', function(error){
			house.log.warning("Error recieved from the connection to sensor " + sensorID + ": " + String(error));
			this.sensors[sensorID].monitor = null;
			house.triggerEvent("sensor-offline", {sensorID: sensorID});
		}.bind(this));
		
		/*
		this.sensors[sensorID].monitor.on('timeout', function(error){
			console.log("Time Out");
			console.log(error);
		}.bind(this));
*/
/*
		this.sensors[sensorID].monitor.on('close', function(error){
			console.log("Connection Closed");
			console.log(error);
		}.bind(this));
*/
		// Handle Data
		this.sensors[sensorID].monitor.on('data', function(data){
			// This is a raw stream, so we buffer the data, looking for a line return and feed to seperate values
			this.sensors[sensorID].buffer += String(data);
			if(this.sensors[sensorID].buffer.indexOf("\r\n") != -1){
				let dataFragments = this.sensors[sensorID].buffer.split("\r\n");
				this.sensors[sensorID].buffer = dataFragments[1];
				house.triggerEvent('sensor-reported', {value: dataFragments[0]});
				this.handleSensorData(sensorID, dataFragments[0]);
			}
			
		}.bind(this));

	};

	this.handleSensorData = function(sensorID, data){
		// Set the last reported value
		this.sensors[sensorID].value = data;

		// Set the history
		this.sensors[sensorID].history.push({date: date.getDateTime(), value: data});

		// Get the average if we have enough data
		if(this.sensors[sensorID].avgCount <= this.sensors[sensorID].history.length){
			let avg = 0;
			for(var i = 0; i < this.sensors[sensorID].avgCount; i++){
				avg = parseFloat(avg) + parseFloat(this.sensors[sensorID].history[(this.sensors[sensorID].history.length -1 - i)].value);
			}
			avg = avg/this.sensors[sensorID].avgCount;
			this.sensors[sensorID].avg = avg;
			house.triggerEvent(this.sensors[sensorID].reportEvent, {value: avg});
		}


	};

	this.restart = function(sensorID){
		if(!this.sensorsAvailable[sensorID].retry){
			return;
		}
		setTimeout(function(){
			this.connectSensor(sensorID);
		}.bind(this), this.sensorsAvailable[sensorID].retry);
	};

	this.start = function(){
		for(var sensorID in this.sensorsAvailable){
			this.connectSensor(sensorID);
		}
	};

	this.stop = function(){
		for(var sensorID in this.sensors){
			this.sensors[sensorID].monitor.destroy();
			house.triggerEvent("sensor-offline", {sensorID: sensorID});
		}
		house.triggerEvent('sensor-monitor-stopped');
	};

	return this;

};

