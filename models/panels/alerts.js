var date = require.main.require('./helpers/date-time');

module.exports = function(house){
	var model = {};


	model.motionLastDetected = date.getFriendlyDate(house.status.motionLastDetected);
	model.motionWhileAway = house.status.motionWhileAway;
	model.powerStatusUnknown = house.status.powered === false || house.status.powered === true ? false : true;
	model.powered = house.status.powered;


	model.ups = {};
	model.ups.batteryCharge = house.status.upsStatus ? house.status.upsStatus.batteryCharge ? house.status.upsStatus.batteryCharge.split(".")[0] + '%' : '<i>Unknown</i>' : '<i>Unknown</i>';
	model.ups.timeLeft = house.status.upsStatus ? house.status.upsStatus.timeLeft : '<i>Unknown</i>';
	model.ups.timeOnBattery = house.status.upsStatus ? house.status.upsStatus.timeOnBattery : '<i>Unknown</i>';

	model.internet = house.status.internetAccess;
	model.internetOutSince = date.getFriendlyDate(house.status.internetOutSince);

	return model;
};