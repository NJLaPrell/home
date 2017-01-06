var date = require.main.require('./helpers/date-time.js');

module.exports = function(house){
	var eventHistory = house.status.eventHistory;
	var model = {};
	model.events = [];

	var history = null;
	var historyElement = null;
	for(var key in eventHistory){
		history = [];
		for(var i = 0; i < eventHistory[key].length; i++){
			history.unshift(eventHistory[key][i]);
		}
		historyElement = {};
		historyElement[date.getFriendlyDay(key)] = history;
		model.events.unshift(historyElement);
	}

	return model;

};