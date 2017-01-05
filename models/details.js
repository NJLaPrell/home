
module.exports = function(house){
	var model = {};

	model.jobWarning = false;
	model.jobCount = Object.keys(house.jobsRegistered).length;
	for(var name in house.jobsRegistered){
		if(house.jobsRegistered[name].exceptionList.length > 0){
			model.jobWarning = true;
			break;
		}
	}

	model.serviceWarning = false;
	model.serviceCount = Object.keys(house.servicesRegistered).length;
	for(var name in house.servicesRegistered){
		if(house.servicesRegistered[name].exceptionList.length > 0){
			model.serviceWarning = true;
			break;
		}
	}

	model.pollWarning = false;
	model.pollCount = Object.keys(house.pollsRegistered).length;
	for(var name in house.pollsRegistered){
		if(house.pollsRegistered[name].exceptionList.length > 0){
			model.pollWarning = true;
			break;
		}
	}

	model.listenerWarning = false;
	model.listenerCount = Object.keys(house.listenersRegistered).length;
	for(var name in house.listenersRegistered){
		if(house.listenersRegistered[name].exceptionList.length > 0){
			model.listenerWarning = true;
			break;
		}
	}

	return model;
};