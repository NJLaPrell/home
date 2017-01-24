var date = require.main.require('./helpers/date-time');

module.exports = function(house){
	var model = {};

	model.motionLastDetected = date.getFriendlyDate(house.status.motionLastDetected);
	model.motionDetected = house.status.motionLastDetected ? true : false;

	model.lastRDPConnection = house.status.lastRDPConnection ? date.getFriendlyDate(house.status.lastRDPConnection) : null;
	model.RDPConnectionDetected = house.status.lastRDPConnection ? true : false;

	model.ups = {};
	model.upsStatusUnknown = house.status.upsStatus ? false : true;
	model.ups.status = house.status.upsStatus ? house.status.upsStatus.status : 'Unknown';
	model.ups.startTime = house.status.upsStatus ? house.status.upsStatus.startTime : 'Unknown';
	model.ups.onBattery = model.ups.status == 'ONBATT' ? true : false;
	model.ups.lineVoltage = house.status.upsStatus ? house.status.upsStatus.lineVoltage : 'Unknown';
	model.ups.loadPercent = house.status.upsStatus ? house.status.upsStatus.loadPercent : 'Unknown';
	model.ups.batteryCharge = house.status.upsStatus ? house.status.upsStatus.batteryCharge.split(".")[0] + '%' : 'Unknown';
	model.ups.timeLeft = house.status.upsStatus ? house.status.upsStatus.timeLeft : 'Unknown';
	model.ups.batteryVoltage = house.status.upsStatus ? house.status.upsStatus.batteryVoltage : 'Unknown';
	model.ups.timeOnBattery = house.status.upsStatus ? house.status.upsStatus.timeOnBattery : 'Unknown';

	return model;
	
};