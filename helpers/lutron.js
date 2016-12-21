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

	// Initialize light states
	for(var i = 0; i < house.status.caseta.dimmers.length; i++){
		house.status.caseta.dimmers[i].brightness = null;
	}

	this.connect = function(){

		// Make a telnet connection
		this.lutron = net.connect(23, this.host);

		self = this;

		// Respond to incomming data
		this.lutron.on('data', function(data){

			self.readyForCommand = true;

			if(house.conf.debug){
				console.log("<<< " + String(data));
			}

			// Login prompt
			if(String(data) == 'login: '){
				self.sendCommand(self.username);	

			// Password prompt
			} else if(String(data) == 'password: '){
				self.sendCommand(self.password);

			// General prompt
			} else if(String(data) == 'GNET> '){

			// Device state changed
			} else if(String(data).indexOf('~OUTPUT') != -1) {
				self.updateDeviceStatus(String(data));

			// Remote button pressed
			} else if(String(data).indexOf('~DEVICE') != -1) {

			// Unexpected response
			} else {
				house.log.warning("Unexpected response from Caseta hub: " + String(data));
			}

			// Process any queued commands
			self.processCommandQueue();

		});
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
			}
		}
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
			if(house.conf.debug){
				console.log(">>> " + cmd);	
			}
		}
	};

	return this;
};

