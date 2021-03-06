var date = require.main.require('./helpers/date-time');
var fs = require('fs');

module.exports = function(house, room){
	var model = {};


	// Edimax Smart Plug Information
	var plugs = house.status.plugs;

	var wemo = house.status.wemo;

	// Hue Light Information
	var hue = {};
	hue.lights = {};
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
		hue.lights[lightID] = light;
	}
	hue.groups = {};
	var group;
	for(var groupID in house.status.hue.groups){
		group = {};
		group.name = house.status.hue.groups[groupID].name;
		group.lights = {};
		for(var i = 0; i < house.status.hue.groups[groupID].lights.length; i++){
			lightID = house.status.hue.groups[groupID].lights[i];
			if(hue.lights[lightID]){
				group.lights[lightID] = hue.lights[lightID];	
			}
			
		}
		hue.groups[groupID] = group;
	}

	// Caseta switch information
	var caseta = {};
	caseta.dimmers = house.status.caseta.dimmers;
	for(var i = 0; i < house.status.caseta.dimmers.length; i++){
		caseta.dimmers[i].on = house.status.caseta.dimmers[i].brightness > 0 ? true : false;
	}







	var groupIdx = null;
	house.conf.deviceLayout.forEach(function(group, index){
		if(group.room == room){
			groupIdx = index;
		}
	});

	model.isLighted = false;
	var devices = house.conf.deviceLayout[groupIdx].devices;

	for(var i = 0; i < devices.length; i++){
			devices[i].hue = devices[i].type == 'hue' || devices[i].type == 'hue-color' ? true : false;
			devices[i].hueColor = devices[i].type == 'hue-color' ? true : false;
			devices[i].edimaxSwitch = devices[i].type == 'edimax-switch' ? true : false;
			devices[i].casetaDimmer = devices[i].type == 'caseta-dimmer' ? true : false;
			devices[i].wemoSwitch = devices[i].type == 'wemo-switch' ? true : false;
			if(devices[i].type == 'hue' || devices[i].type == 'hue-color'){
				devices[i].device = hue.lights[devices[i].identifyer];
				if(hue.lights[devices[i].identifyer].on && devices[i].isLight){
					model.isLighted = true;	
				}
			} else if(devices[i].type == 'edimax-switch'){
				devices[i].device = plugs[devices[i].identifyer];
				if(plugs[devices[i].identifyer] && devices[i].isLight){
					model.isLighted = true;
				}

			} else if(devices[i].type == 'wemo-switch'){ 
				if(wemo[devices[i].identifyer]){
					devices[i].device = wemo[devices[i].identifyer].binaryState == 1 ? true : false;
					if(wemo[devices[i].identifyer].binaryState == 1 && devices[i].isLight){
						model.isLighted = true;
					}
				}
			} else if(devices[i].type == 'caseta-dimmer'){
				for(var iii = 0; iii < caseta.dimmers.length; iii++){
					if (caseta.dimmers[iii].id == devices[i].identifyer){
						devices[i].device = caseta.dimmers[iii];
						if(caseta.dimmers[iii].on && devices[i].isLight){
							model.isLighted = true;	
						}
					}
				}
			}
		
	}

	model.devices = devices;
	model.room = room.replace(/ /g,"").replace(/\'/g,"").toLowerCase();

	return model;
};