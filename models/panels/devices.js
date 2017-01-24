var date = require.main.require('./helpers/date-time');
var fs = require('fs');

module.exports = function(house){
	var model = {};


	// Edimax Smart Plug Information
	model.plugs = house.status.plugs;

	model.wemo = house.status.wemo;

	// Hue Light Information
	model.hue = {};
	model.hue.lights = {};
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
		model.hue.lights[lightID] = light;
	}
	model.hue.groups = {};
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
		model.hue.groups[groupID] = group;
	}

	// Caseta switch information
	model.caseta = {};
	model.caseta.dimmers = house.status.caseta.dimmers;
	for(var i = 0; i < house.status.caseta.dimmers.length; i++){
		model.caseta.dimmers[i].on = house.status.caseta.dimmers[i].brightness > 0 ? true : false;
	}



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
				devices[i].devices[ii].device = model.hue.lights[devices[i].devices[ii].identifyer];
				if(model.hue.lights[devices[i].devices[ii].identifyer].on && devices[i].devices[ii].isLight){
					devices[i].isLighted = true;	
				}
			} else if(devices[i].devices[ii].type == 'edimax-switch'){
				devices[i].devices[ii].device = model.plugs[devices[i].devices[ii].identifyer];
				if(model.plugs[devices[i].devices[ii].identifyer] && devices[i].devices[ii].isLight){
					devices[i].isLighted = true;
				}

			} else if(devices[i].devices[ii].type == 'wemo-switch'){ 
				if(model.wemo[devices[i].devices[ii].identifyer]){
					devices[i].devices[ii].device = model.wemo[devices[i].devices[ii].identifyer].binaryState == 1 ? true : false;
					if(model.wemo[devices[i].devices[ii].identifyer].binaryState == 1 && devices[i].devices[ii].isLight){
						devices[i].isLighted = true;
					}
				}
			} else if(devices[i].devices[ii].type == 'caseta-dimmer'){
				for(var iii = 0; iii < model.caseta.dimmers.length; iii++){
					if (model.caseta.dimmers[iii].id == devices[i].devices[ii].identifyer){
						devices[i].devices[ii].device = model.caseta.dimmers[iii];
						if(model.caseta.dimmers[iii].on && devices[i].devices[ii].isLight){
							devices[i].isLighted = true;	
						}
					}
				}
			}
		}
	}

	model.devices = devices;

	return model;
};