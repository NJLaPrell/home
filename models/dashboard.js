var date = require('../helpers/date-time');
var fs = require('fs');

module.exports = function(house){
	var model = {};
	model.status = {};

	model.status.serverTime = date.getDateTime();

	// Weather Information
	model.status.daytime = house.status.daytime;
	model.status.nighttime = house.status.nighttime;
	model.status.timeOfDayUnknown = house.status.daytime || house.status.nighttime ? false : true;
	model.status.currentWeather = house.status.currentWeather;
	model.status.weatherDataAvailable = house.status.currentWeather.description ? true : false;

	// Location Information
	model.status.nickIsHome = house.status.nickslocation == 'home' ? true : false;
	model.status.nickIsAway = house.status.nickslocation == 'away' ? true : false;
	model.status.nickIsUnknown = house.status.nickslocation ? false : true;
	model.status.brendaIsHome = house.status.brendaslocation == 'home' ? true : false;
	model.status.brendaIsAway = house.status.brendaslocation == 'away' ? true : false;
	model.status.brendaIsUnknown = house.status.brendaslocation ? false : true;

	// Camera Information
	model.status.motionLastDetected = date.getFriendlyDate(house.status.motionLastDetected);
	model.status.motionDetected = house.status.motionLastDetected ? true : false;
	model.status.motionWhileAway = house.status.motionWhileAway;

	// RDP Login Information
	model.status.lastRDPConnection = house.status.lastRDPConnection ? date.getFriendlyDate(house.status.lastRDPConnection) : null;
	model.status.RDPConnectionDetected = house.status.lastRDPConnection ? true : false;

	// Power Information
	model.status.powerStatusUnknown = house.status.powered === false || house.status.powered === true ? false : true;
	model.status.powered = house.status.powered;
	model.status.powerOutSince = date.getFriendlyDate(house.status.powerOutSince);	
	model.status.ups = {};
	model.status.upsStatusUnknown = house.status.upsStatus ? false : true;
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
	model.status.internetAccessUnknown = house.status.internetAccess === false || house.status.internetAccess === true ? false : true;
	model.status.internet = house.status.internetAccess;
	model.status.internetOutSince = date.getFriendlyDate(house.status.internetOutSince);
	
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

	// Edimax Smart Plug Information
	model.status.plugs = house.status.plugs;

	model.status.wemo = house.status.wemo;

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
		light.rgb = false;
		light.colorPreset = {};
		if(house.status.hue.lights[lightID].state.rgb){
			var r = house.status.hue.lights[lightID].state.rgb[0];
			var g = house.status.hue.lights[lightID].state.rgb[1];
			var b = house.status.hue.lights[lightID].state.rgb[2];
			light.rgb = 'rgb ' + r + ' ' + g + ' ' + b;
			for(var color in house.colorPreset){
				if(house.colorPreset[color][0] == r && house.colorPreset[color][1] == g && house.colorPreset[color][2] == b ){
					light.colorPreset[color] = true;
				} else {
					light.colorPreset[color] = false;
				}
			}
		}
		model.status.hue.lights[lightID] = light;
	}
	model.status.hue.groups = {};
	var group;
	for(var groupID in house.status.hue.groups){
		group = {};
		group.name = house.status.hue.groups[groupID].name;
		group.lights = {};
		for(var i = 0; i < house.status.hue.groups[groupID].lights.length; i++){
			lightID = house.status.hue.groups[groupID].lights[i];
			if(model.status.hue.lights[lightID]){
				group.lights[lightID] = model.status.hue.lights[lightID];	
			}
			
		}
		model.status.hue.groups[groupID] = group;
	}

	// Caseta switch information
	model.status.caseta = {};
	model.status.caseta.dimmers = house.status.caseta.dimmers;
	for(var i = 0; i < house.status.caseta.dimmers.length; i++){
		model.status.caseta.dimmers[i].on = house.status.caseta.dimmers[i].brightness > 0 ? true : false;
	}


	// History Information
	model.status.eventHistory = house.status.eventHistory;



	var devices = house.conf.deviceLayout;
	for(var i = 0; i < devices.length; i++){
		devices[i].isLighted = false;
		for(var ii = 0; ii < devices[i].devices.length; ii++){
			devices[i].devices[ii].hue = devices[i].devices[ii].type == 'hue' || devices[i].devices[ii].type == 'hue-color' ? true : false;
			devices[i].devices[ii].hueColor = devices[i].devices[ii].type == 'hue-color' ? true : false;
			devices[i].devices[ii].edimaxSwitch = devices[i].devices[ii].type == 'edimax-switch' ? true : false;
			devices[i].devices[ii].casetaDimmer = devices[i].devices[ii].type == 'caseta-dimmer' ? true : false;
			devices[i].devices[ii].wemoSwitch = devices[i].devices[ii].type == 'wemo-switch' ? true : false;
			if(devices[i].devices[ii].type == 'hue' || devices[i].devices[ii].type == 'hue-color'){
				devices[i].devices[ii].device = model.status.hue.lights[devices[i].devices[ii].identifyer];
				if(model.status.hue.lights[devices[i].devices[ii].identifyer].on && devices[i].devices[ii].isLight){
					devices[i].isLighted = true;	
				}
			} else if(devices[i].devices[ii].type == 'edimax-switch'){
				devices[i].devices[ii].device = model.status.plugs[devices[i].devices[ii].identifyer];
				if(model.status.plugs[devices[i].devices[ii].identifyer] && devices[i].devices[ii].isLight){
					devices[i].isLighted = true;
				}

			} else if(devices[i].devices[ii].type == 'wemo-switch'){ 
				devices[i].devices[ii].device = model.status.wemo[devices[i].devices[ii].identifyer].binaryState == 1 ? true : false;
				if(model.status.wemo[devices[i].devices[ii].identifyer].binaryState == 1 && devices[i].devices[ii].isLight){
					devices[i].isLighted = true;
				}
			} else if(devices[i].devices[ii].type == 'caseta-dimmer'){
				for(var iii = 0; iii < model.status.caseta.dimmers.length; iii++){
					if (model.status.caseta.dimmers[iii].id == devices[i].devices[ii].identifyer){
						devices[i].devices[ii].device = model.status.caseta.dimmers[iii];
						if(model.status.caseta.dimmers[iii].on && devices[i].devices[ii].isLight){
							devices[i].isLighted = true;	
						}
					}
				}
			}
		}
	}

	model.status.devices = devices;

	return model;
};