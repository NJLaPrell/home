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

	this.connect = function(){
		
		// Make a telnet connection
		this.lutron = net.connect(23, this.host);

		this.lutron.on('error', function(error){
			throw error;
		});

		// Respond to incomming data
		this.lutron.on('data', function(data){

			this.readyForCommand = this.connected ? true : false;

			house.log.debug("Lutron Data Received: " + String(data));

			// Login prompt
			if(String(data) == 'login: '){
				this.lutron.write(this.username + "\r\n");
			// Password prompt
			} else if(String(data) == 'password: '){
				this.lutron.write(this.password + "\r\n");
			// General prompt
			} else if(String(data) == 'GNET> '){
				if(!this.connected){
					this.connected = true;
					this.readyForCommand = true;
					this.lutron.write("\r\n");
					house.triggerEvent('lutron-connected');
				}
			// Device state changed
			} else if(String(data).indexOf('~OUTPUT') != -1) {
				this.updateDeviceStatus(String(data));
			// Device state changed
			} else if(String(data).indexOf('#OUTPUT') != -1) {
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
		house.triggerEvent('lutron-changed', {deviceID: deviceID, brightness: parseInt(params)});
	};

	this.pollDeviceStatus = function(deviceID, cb){
		this.sendCommand("?OUTPUT," + deviceID + ",1", cb);
	};

	this.setBrightness = function(light, level, cb){
		this.sendCommand("#OUTPUT," + light + ",1," + level, cb(true));
	};

	this.disconnect = function(){
		this.lutron.detroy();
	};

	this.sendCommand = function(cmd, cb){
		this.commandQueue.push({cmd:cmd, cb:cb});
		this.processCommandQueue();
	};

	this.processCommandQueue = function(){
		if(this.commandQueue.length && this.readyForCommand){
			this.readyForCommand = false;
			var cmd = this.commandQueue.shift();
			this.lutron.write(cmd.cmd + "\r\n", cmd.cb);
			house.log.debug("Lutron Data Sent: " + cmd);
			console.log("Lutron Data Sent: " + cmd);
		}
	};

	return this;
};

