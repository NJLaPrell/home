
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
		model.listeners.push(listener);
	}
	
	return model;
};