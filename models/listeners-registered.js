var date = require.main.require('./helpers/date-time.js');

module.exports = function(house){
	var model = {};
	model.listeners = [];
	var listener;
	var name;

	let names = Object.keys(house.listenersRegistered);
	names.sort();
	for(var i = 0; i < names.length; i++){
		name = names[i];
		listener = {};
		listener.name = name;
		listener.description = house.listenersRegistered[name].description ? house.listenersRegistered[name].description : '<i>None Given</i>';
		listener.events = house.listenersRegistered[name].eventsFired.length ? true : false;
		listener.eventsTriggered = house.listenersRegistered[name].eventsFired;
		listener.eventsListenedPresent = house.listenersRegistered[name].eventsListened.length ? true : false;
		listener.eventsListened = house.listenersRegistered[name].eventsListened;

		listener.icon = !house.listenersRegistered[name].running ? 'stopped' : house.listenersRegistered[name].consecutiveExceptionCount > 0 ? 'warning' : false;
		listener.showIcon = listener.icon ? true : false;
		listener.consecutiveExceptionCount = house.listenersRegistered[name].consecutiveExceptionCount;
		listener.exceptionList = house.listenersRegistered[name].exceptionList;
		listener.running = house.listenersRegistered[name].running;
		listener.lastTriggered = house.listenersRegistered[name].lastTriggered ? date.getFriendlyDate(house.listenersRegistered[name].lastTriggered) : '<i>Never</i>';
		
		model.listeners.push(listener);
	}
	
	return model;
};