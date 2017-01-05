// Required Modules
var events = require('events');
var net = require('net');

module.exports = function(house){
	this.lutron = null;
	this.host = house.conf.lutron.host;
	this.username = house.conf.lutron.username;
	this.password = house.conf.lutron.password;
	this.commandQueue = [];
	this.readyForCommand = false;
	this.connected = false;

	// Initialize light states
	for(var i = 0; i < house.status.caseta.dimmers.length; i++){
		house.status.caseta.dimmers[i].brightness = null;
	}

	this.connect = function(){
		
		// Make a telnet connection
		this.lutron = net.connect(23, this.host);

		this.lutron.on('error', function(error){
			house.log.error(error);
		});

		// Respond to incomming data
		this.lutron.on('data', function(data){

			this.readyForCommand = true;

			house.log.debug("Lutron Data Received: " + String(data));

			// Login prompt
			if(String(data) == 'login: '){
				this.sendCommand(this.username);	

			// Password prompt
			} else if(String(data) == 'password: '){
				this.sendCommand(this.password);

			// General prompt
			} else if(String(data) == 'GNET> '){
				if(!this.connected){
					this.connected = true;
					house.triggerEvent('lutron-connected');
				}
			// Device state changed
			} else if(String(data).indexOf('~OUTPUT') != -1) {
				this.updateDeviceStatus(String(data));

			// Remote button pressed
			} else if(String(data).indexOf('~DEVICE') != -1) {

			// Unexpected response
			} else {
				house.log.warning("Unexpected response from Caseta hub: " + String(data));
			}

			// Process any queued commands
			this.processCommandQueue();

		}.bind(this));
	};

	this.updateDeviceStatus = function(output){
		var commands = output.split(",");
		var deviceID = commands[1];
		var action = commands[2];
		var params = commands[3];

		// Dimmer update
		for(var i = 0; i < house.status.caseta.dimmers.length; i++){
			if(house.status.caseta.dimmers[i].id == deviceID){
				house.status.caseta.dimmers[i].brightness = parseInt(params);
				house.triggerEvent('lutron-changed', {deviceID: deviceID, brightness: parseInt(params)});
			}
		}
	};

	this.pollDeviceStatus = function(deviceID){
		this.sendCommand("?OUTPUT," + deviceID + ",1");
	};

	this.setBrightness = function(light, level){
		this.sendCommand("#OUTPUT," + light + ",1," + level);
	};

	this.turnOn = function(light){
		this.setBrightness(light, '100');
	};

	this.turnOff = function(light){
		this.setBrightness(light, '0');
	};

	this.disconnect = function(){
		this.lutron.detroy();
	};

	this.sendCommand = function(cmd){
		this.commandQueue.push(cmd);
		this.processCommandQueue();
	};

	this.processCommandQueue = function(){
		if(this.commandQueue.length && this.readyForCommand){
			this.readyForCommand = false;
			var cmd = this.commandQueue.shift();
			this.lutron.write(cmd + "\r\n");
			house.log.debug("Lutron Data Sent: " + cmd);
		}
	};

	return this;
};

