var date = require.main.require('./helpers/date-time.js');
var net = require('net');

module.exports = function(sensorID, house){
	this.id = sensorID;
	this.monitor = null;

	this.host = house.conf.sensors[this.id].host;
	this.avgCount = house.conf.sensors[sensorID].avgCount;
	this.reportEvent = house.conf.sensors[sensorID].reportEvent;
	this.heartbeatInterval = house.conf.sensors[this.id].heartbeatInterval;
	this.retryTime = house.conf.sensors[this.id].retry;
	this.type = house.conf.sensors[this.id].type;
	this.reportBeforeAvgCount = house.conf.sensors[this.id].reportBeforeAvgCount;
	
	this.history = [];
	this.value = null;
	this.avg = null;
	this.buffer = '';
	this.ping = null;
	this.lastPingResult = null;
	this.lastPingTime = null;
	this.connected = false;
	


	this.connect = function(){
		house.log.debug("Attempting to connect to sensor: " + this.id);
		this.monitor = net.connect(23, this.host);

		// Handle Data
		this.monitor.on('data', function(data){
			this.readData(data);
		}.bind(this));

		// Handle Errors
		this.monitor.on('error', function(error){
			house.log.warning("Error recieved from the connection to sensor " + this.id + ": " + String(error));
			house.triggerEvent("sensor-error", {sensorID: sensorID, error: String(error)});
			this.stop();
			this.retry();
		}.bind(this));

		// Ping
		this.startPing();
	};

	this.startPing = function(){
		this.sendPing();
		this.ping = setInterval(function(){
			if(this.lastPingResult == 'waiting'){
				this.timeout();
			} else {
				this.sendPing();
			}
		}.bind(this), this.heartbeatInterval);
	};

	this.stop = function(){
		house.log.debug("Stopping sensor: " + this.id);
		this.monitor.destroy();
		this.monitor = null;
		this.connected = false;
		house.triggerEvent("sensor-offline", {sensorID: sensorID});
		this.buffer = '';
		clearInterval(this.ping);
		this.ping = null;
	};

	this.retry = function(){
		if(!this.retryTime){
			return;
		}
		house.log.debug("Scheduling reconnect attempt for sensor: " + this.id + " in " + this.retryTime + " milliseconds");
		setTimeout(function(){
			this.connect();
		}.bind(this), this.retryTime);
	};

	this.sendPing = function(){
		house.log.debug("Pinging sensor: " + this.id);
		this.sendCommand("PING");
		this.setPingResult('waiting');
		this.lastPingSent = date.getDateTime();
	};

	this.sendCommand = function(cmd){
		this.monitor.write(cmd + "\r\n");
	};

	this.timeout = function(){
		house.log.debug("Unresponsive to ping. Timing out sensor: " + this.id);
		this.setPingResult('timedout');
		house.triggerEvent("sensor-timeout", {sensorID: sensorID});
		this.stop();
		this.retry();
	};

	this.getID = function(){
		return this.id;
	};


	this.setPingResult = function(result){
		this.lastPingResult = result;
	};

	this.readData = function(data){
		this.buffer += String(data);
		// Commands are seperated by line returns.
		if(this.buffer.indexOf("\r\n") != -1){
			// Get the buffer value up to the new line.
			var dataFragments = this.buffer.split("\r\n");
			// If any characters remain, put them back in the buffer.
			this.buffer = dataFragments[1];
			// If the data recieved is a PING, update the ping result.
			if(dataFragments[0] == 'PING'){
				if(!this.connected){
					this.connected = true;
					house.log.debug("Sensor \"" + this.id + "\" responded to ping, indicating a successful connection.");
					house.triggerEvent('sensor-connected', {sensorID: sensorID});
				}
				house.log.debug("Sensor \"" + this.id + "\" responded to ping.");
				this.setPingResult('success');
			} else {
				// Data received is a sensor reported value.
				house.log.debug("Sensor \"" + this.id + "\" reported: " + dataFragments[0]);
				house.triggerEvent('sensor-reported', {value: dataFragments[0]});
				this.handleSensorData(dataFragments[0]);				
			}

		}
	};

	this.handleSensorData = function(data){
		if(isNaN(data)){
			house.log.warning("Sensor " + this.id + " reported non-numeric value: " + data);
			return;
		}
		// Set the last reported value
		this.value = data;

		// Set the history
		this.history.push({date: date.getDateTime(), value: data});

		// Get the average if we have enough data
		if(this.avgCount <= this.history.length || this.reportBeforeAvgCount){
			var avgCount = this.avgCount <= this.history.length ? this.avgCount : this.history.length;
			var avg = 0;
			for(var i = 0; i < avgCount; i++){
				avg = parseFloat(avg) + parseFloat(this.history[(this.history.length -1 - i)].value);
			}
			this.avg = avg/avgCount;
			house.triggerEvent(this.reportEvent, {value: this.avg});
			house.log.debug("Sensor \"" + this.id + "\" calculated an average of " + this.avg + " over " + avgCount + " data points.");
		}
	};

	return this;
};