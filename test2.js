var house = require('./helpers/house-status.js');
var Devices = require('./helpers/devices.js');
var util = require('util');


var devices = new Devices(house);

devices.getDeviceStatus();


devices.update(13, {on:true}, function(res){
	console.log(res);
});

