var date = require('../helpers/date-time');
var fs = require('fs');

module.exports = function(house){
	var model = {};
	model.status = {};

	model.status.serverTime = date.getDateTime();

	// Weather Information
	model.status.daytime = house.status.daytime;
	model.status.nighttime = house.status.nighttime;
	model.status.currentWeather = house.status.currentWeather;

	// Location Information
	model.status.nickIsHome = house.status.nickslocation == 'home' ? true : false;
	model.status.nickIsAway = house.status.nickslocation == 'away' ? true : false;
	model.status.nickIsUnknown = house.status.nickslocation ? false : true;
	model.status.brendaIsHome = house.status.brendaslocation == 'home' ? true : false;
	model.status.brendaIsAway = house.status.brendaslocation == 'away' ? true : false;
	model.status.brendaIsUnknown = house.status.brendaslocation ? false : true;

	// Camera Information
	model.status.motionLastDetected = house.status.motionLastDetected;
	model.status.motionDetected = house.status.motionLastDetected ? true : false;
	model.status.motionWhileAway = house.status.motionWhileAway;

	// Power Information
	model.status.powered = house.status.powered;
	model.status.powerOutSince = house.status.powerOutSince;	
	model.status.ups = {};
	model.status.ups.status = house.status.upsStatus ? house.status.upsStatus.status : 'Unknown';
	model.status.ups.startTime = house.status.upsStatus ? house.status.upsStatus.startTime : 'Unknown';
	model.status.ups.onBattery = model.status.ups.status == 'ONBATT' ? true : false;
	model.status.ups.lineVoltage = house.status.upsStatus ? house.status.upsStatus.lineVoltage : 'Unknown';
	model.status.ups.loadPercent = house.status.upsStatus ? house.status.upsStatus.loadPercent : 'Unknown';
	model.status.ups.batteryCharge = house.status.upsStatus ? house.status.upsStatus.batteryCharge.split(".")[0] + '%' : 'Unknown';
	model.status.ups.timeLeft = house.status.upsStatus ? house.status.upsStatus.timeLeft : 'Unknown';
	model.status.ups.batteryVoltage = house.status.upsStatus ? house.status.upsStatus.batteryVoltage : 'Unknown';
	model.status.ups.timeOnBattery = house.status.upsStatus ? house.status.upsStatus.timeOnBattery : 'Unknown';
	
	// Internet Information
	model.status.internet = house.status.internetAccess;
	model.status.internetOutSince = house.status.internetOutSince;
	
	// TV Information
	model.status.tv = {
		on: (house.status.tvStatus == 'on' ? true : false),
		of: (house.status.tvStatus == 'off' ? true : false),
		sleeping: (house.status.tvStatus == 'sleeping' ? true : false)
	};
	
	// Debug Information
	model.debug = {
		listenersTriggered: house.listenersTriggered,
		listenersRegistered: house.listenersRegistered,
		eventsFired: house.eventsFired
	};
	model.errorLog  = fs.readFileSync(__dirname + '/../logs/log.log');

	// Edimax Smart Plug Information
	model.status.plugs = house.status.plugs;

	// Hue Light Information
	model.status.hue = {};
	model.status.hue.lights = {};
	var light;
	for(var lightID in house.status.hue.lights){
		light = {};
		light.name = house.status.hue.lights[lightID].name;
		light.on = house.status.hue.lights[lightID].state.on;
		light.bri = house.status.hue.lights[lightID].state.bri;
		light.hue = house.status.hue.lights[lightID].state.hue ? house.status.hue.lights[lightID].state.hue : false;
		light.sat = house.status.hue.lights[lightID].state.sat ? house.status.hue.lights[lightID].state.sat : false;
		model.status.hue.lights[lightID] = light;
	}
	model.status.hue.groups = {};
	var group;
	var lightID;
	for(var groupID in house.status.hue.groups){
		group = {};
		group.name = house.status.hue.groups[groupID].name;
		group.lights = {};
		for(var i = 0; i < house.status.hue.groups[groupID].lights.length; i++){
			lightID = house.status.hue.groups[groupID].lights[i]
			if(model.status.hue.lights[lightID]){
				group.lights[lightID] = model.status.hue.lights[lightID];	
			}
			
		}
		model.status.hue.groups[groupID] = group;
	}


	// History Information
	model.status.eventHistory = house.status.eventHistory;

	return model;
};