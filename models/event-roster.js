
module.exports = function(house){
	var model = {};
	model.events = [];

	var eventNames = Object.keys(house.eventRoster);

	eventNames.sort();

	var event;
	var name;
	for(var i = 0; i < eventNames.length; i++){
		event = {};
		name = eventNames[i];
		event.name = name;
		event.lastTriggered = house.eventRoster[name].lastTriggered ? house.eventRoster[name].lastTriggered : '<i>Never</i>';
		event.description = house.eventRoster[name].description;
		event.type = house.eventRoster[name].type;
		event.args = house.eventRoster[name].args;
		event.hasArgs = house.eventRoster[name].args ? true : false;
		model.events.push(event);
	}

	return model;
};