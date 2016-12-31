var date = require.main.require('./helpers/date-time.js');

module.exports = function(house){
	var model = {};
	model.polls = [];
	var poll;

	for(var name in house.pollsRegistered){
		poll = {};
		poll.name = name;
		poll.description = house.pollsRegistered[name].description ? house.pollsRegistered[name].description : '<i>None Given</i>';
		poll.lastRun = house.pollsRegistered[name].lastRun ? date.getFriendlyDate(house.pollsRegistered[name].lastRun) : '<i>Never</i>';
		poll.interval = house.pollsRegistered[name].intervalString;
		poll.events = house.pollsRegistered[name].eventsTriggered.length ? true : false;
		poll.eventsTriggered = house.pollsRegistered[name].eventsTriggered;
		poll.executeOnStartup = house.pollsRegistered[name].executeOnStartup;
		model.polls.push(poll);
	}
	
	return model;
};