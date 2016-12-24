
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
		service.startTime = house.servicesRegistered[name].startTime ? house.servicesRegistered[name].startTime : '<i>Not Running</i>';
		model.services.push(service);
	}
	
	return model;
};