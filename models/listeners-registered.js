
module.exports = function(house){
	var model = {};
	model.listeners = [];
	var listener;

	for(var name in house.listenersRegistered){
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
		
		model.listeners.push(listener);
	}
	
	return model;
};