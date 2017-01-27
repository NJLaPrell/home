EdimaxSwitch = require.main.require('./helpers/devices/edimax-switch.js');
HueLight = require.main.require('./helpers/devices/hue.js');
CasetaDimmer = require.main.require('./helpers/devices/caseta.js');
Sensor = require.main.require('./helpers/devices/sensor.js');
WemoSwitch = require.main.require('./helpers/devices/wemo.js');

module.exports = function(house) {
	this.devices = {};
	this.devicesPerRoom = {};

	this.getDevice = function(deviceId) {
		if(typeof this.devices[deviceId] === 'undefined') {
			house.log.error("Devices::getDevice called for id: " + deviceId + ", but the device does not exist.");
			return false;
		} else {
			return this.devices[deviceId];
		}
	};

	this.getRoomList = function() {
		return Object.keys(this.devicesPerRoom);
	};

	this.getDevicesInRoom = function(room) {
		if(typeof this.devicesPerRoom[room] === 'undefined') {
			house.log.error("Devices::getDevicesInRoom called for room: " + room + ", but the room does not exist.");
			return false;
		}
		var deviceList = {};
		this.devicesPerRoom[room].forEach(function(device, id) {
			deviceList[id] = device;
		});
		return deviceList;
	};

	this.on = function(deviceId) {
		return this.update(deviceId, {on: true});
	};

	this.off = function(deviceId) {
		return this.update(deviceId, {on: false});
	};

	this.togglePowerState = function(deviceId, cb) {
		this.poll(deviceId, function(status){
			this.update(deviceId, {on: !status.on}, cb);
		}.bind(this));
	};

	this.update = function(deviceId, settings, cb) {
		if(this.devices[deviceId]){
			for(var i in settings){
				if(this.devices[deviceId].status.capabilities.indexOf(i) == -1){
					house.log.error("Devices::update called with method: " + i + ", but the method is not supported for this device.");
					if(typeof cb === 'function'){
						cb(false);
					}
				}
			}
			this.devices[deviceId].update(settings, cb);
		} else {
			house.log.error("Devices::update called for device: " + deviceId + ", but the device does not exist.");
			if(typeof cb === 'function'){
				cb(false);
			}
		}
	};

	this.poll = function(deviceId, cb) {
		if(this.devices[deviceId]){
			this.devices[deviceId].poll(cb);
		} else {
			house.log.error("Devices::poll called for device: " + deviceId + ", but the device does not exist.");
			if(typeof cb === 'function'){
				cb(false);
			}
		}	
	};

	this.registerDevice = function(device){
		// Generate an ID
		var id = this.getNextDeviceId();
		
		// Instantiate the appropriate class for the device
		if(device.type == 'edimax-switch'){
			this.devices[id] = new EdimaxSwitch(house, device);
		} else if(device.type == 'hue' || device.type == 'hue-color'){
			this.devices[id] = new HueLight(house, device);
		} else if(device.type == 'caseta-dimmer'){
			this.devices[id] = new CasetaDimmer(house, device);	
		} else if(device.type == 'wemo-switch'){
			this.devices[id] = new WemoSwitch(house, device);
		} else if(device.type == 'temperature-sensor'){
			this.devices[id] = new Sensor(house, device);
		}

		// Add the device room assignment
		if(!this.devicesPerRoom[device.room]){
			this.devicesPerRoom[device.room] = [];
		}
		this.devicesPerRoom[device.room].push(id);

		// Poll the device to get the initial state
		this.devices[id].poll(id);
	};

	this.getNextDeviceId = function(){
		var deviceIdList = Object.keys(this.devices);
		if(deviceIdList.length > 0) {
			return Math.max.apply(null, deviceIdList) + 1;
		} else {
			return 1;
		}
		
	};

	this.registerDevices = function(){
		house.conf.devices.forEach(function(device){
			this.registerDevice(device);
		}.bind(this));
	};

	this.getDeviceStatus = function(deviceId){
		if(deviceId){
			if(this.devices[deviceId]){
				return this.devices[deviceId].status;
			} else {
				return false;
			}
		} else {
			var deviceStatusList = {};
			for(var id in this.devices){
				deviceStatusList[id] = this.devices[id].status;
			};
			return deviceStatusList;
		}
	};

	this.registerDevices();

	return this;

};