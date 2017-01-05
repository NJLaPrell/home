
module.exports = function(house){
	var model = {};
	model.services = [];
	var service;

	for(var name in house.servicesRegistered){
		service = {};
		service.name = name;
		service.description = house.servicesRegistered[name].description ? house.servicesRegistered[name].description : '<i>None Given</i>';
		service.type = house.servicesRegistered[name].type;
		service.events = house.servicesRegistered[name].eventsTriggered.length ? true : false;
		service.eventsTriggered = house.servicesRegistered[name].eventsTriggered;
		service.eventsListenedPresent = house.servicesRegistered[name].eventsListened.length ? true : false;
		service.eventsListened = house.servicesRegistered[name].eventsListened;
		service.startTime = house.servicesRegistered[name].startTime ? house.servicesRegistered[name].startTime : '<i>Not Running</i>';

		service.icon = !house.servicesRegistered[name].running ? 'stopped' : house.servicesRegistered[name].consecutiveExceptionCount > 0 ? 'warning' : false;
		service.showIcon = service.icon ? true : false;
		service.consecutiveExceptionCount = house.servicesRegistered[name].consecutiveExceptionCount;
		service.exceptionList = house.servicesRegistered[name].exceptionList;
		service.running = house.servicesRegistered[name].running;

		model.services.push(service);
	}
	
	return model;
};