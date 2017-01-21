var date = require.main.require('./helpers/date-time');

module.exports = function(house){
	var model = {};



	// Weather Information
	model.daytime = house.status.daytime;
	model.nighttime = house.status.nighttime;
	model.timeOfDayUnknown = house.status.daytime || house.status.nighttime ? false : true;

	// Location Information
	model.nickIsHome = house.status.nickslocation == 'home' ? true : false;
	model.nickIsAway = house.status.nickslocation == 'away' ? true : false;
	model.nickIsUnknown = house.status.nickslocation ? false : true;
	model.brendaIsHome = house.status.brendaslocation == 'home' ? true : false;
	model.brendaIsAway = house.status.brendaslocation == 'away' ? true : false;
	model.brendaIsUnknown = house.status.brendaslocation ? false : true;

	// Power Information
	model.powerStatusUnknown = house.status.powered === false || house.status.powered === true ? false : true;
	model.powered = house.status.powered;
	model.powerOutSince = date.getFriendlyDate(house.status.powerOutSince);	
	model.ups = {};
	model.upsStatusUnknown = house.status.upsStatus ? false : true;
	model.ups.onBattery = model.ups.status == 'ONBATT' ? true : false;
	
	
	// Internet Information
	model.internetAccessUnknown = house.status.internetAccess === false || house.status.internetAccess === true ? false : true;
	model.internet = house.status.internetAccess;

	return model;
};