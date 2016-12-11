var date = require('../helpers/date-time');
var fs = require('fs');

module.exports = function(house){
	var model = {}
	model.status = {};
	model.status.serverTime = date.getDateTime();
	model.status.daytime = house.status.daytime 
	model.status.nighttime = house.status.nighttime;
	model.status.nickIsHome = house.status.nickslocation == 'home' ? true : false;
	model.status.nickIsAway = house.status.nickslocation == 'away' ? true : false;
	model.status.nickIsUnknown = house.status.nickslocation ? false : true;
	model.status.brendaIsHome = house.status.brendaslocation == 'home' ? true : false;
	model.status.brendaIsAway = house.status.brendaslocation == 'away' ? true : false;
	model.status.brendaIsUnknown = house.status.brendaslocation ? false : true;
	model.status.motionLastDetected = house.status.motionLastDetected
	model.status.motionDetected = house.status.motionLastDetected ? true : false;
	model.status.powered = house.status.powered;
	model.status.powerOutSince = house.status.powerOutSince;
	model.status.internet = house.status.internetAccess;
	model.status.internetOutSince = house.status.internetOutSince;
	model.status.tv = {
		on: (house.status.tvStatus == 'on' ? true : false),
		of: (house.status.tvStatus == 'off' ? true : false),
		sleeping: (house.status.tvStatus == 'sleeping' ? true : false)
	};
	model.status.ups = {};
	model.status.ups.status = house.status.upsStatus ? house.status.upsStatus.status : 'Unknown';
	model.status.ups.startTime = house.status.upsStatus ? house.status.upsStatus.startTime : 'Unknown';
	model.status.ups.lineVoltage = house.status.upsStatus ? house.status.upsStatus.lineVoltage : 'Unknown';
	model.status.ups.loadPercent = house.status.upsStatus ? house.status.upsStatus.loadPercent : 'Unknown';
	model.status.ups.batteryCharge = house.status.upsStatus ? house.status.upsStatus.batteryCharge.split(".")[0] + '%' : 'Unknown';
	model.status.ups.timeLeft = house.status.upsStatus ? house.status.upsStatus.timeLeft : 'Unknown';
	model.status.ups.batteryVoltage = house.status.upsStatus ? house.status.upsStatus.batteryVoltage : 'Unknown';
	model.status.ups.timeOnBattery = house.status.upsStatus ? house.status.upsStatus.timeOnBattery : 'Unknown';
	model.status.currentWeather = house.status.currentWeather;
	model.debug = {
		listenersTriggered: house.listenersTriggered,
		listenersRegistered: house.listenersRegistered,
		eventsFired: house.eventsFired
	};

	model.errorLog  = fs.readFileSync(__dirname + '/../logs/log.log');

	model.status.eventHistory = house.status.eventHistory;

	return model;
}