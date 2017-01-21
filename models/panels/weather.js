module.exports = function(house){
	var model = {};

	// Weather Information
	model.currentWeather = house.status.currentWeather;
	model.weatherDataAvailable = house.status.currentWeather.description ? true : false;

	return model;
};