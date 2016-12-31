var date = require.main.require('./helpers/date-time.js');

module.exports = function(house){
	var model = {};
	model.jobs = [];

	var job;
	for(var name in house.jobsRegistered){
		job = {};
		job.name = name;
		job.description = house.jobsRegistered[name].description ? house.jobsRegistered[name].description : '<i>None Given</i>';
		job.schedule = house.jobsRegistered[name].schedule;
		job.executeOnStartup = house.jobsRegistered[name].executeOnStartup
		job.events = house.jobsRegistered[name].eventsTriggered.length ? true : false;
		job.eventsTriggered = house.jobsRegistered[name].eventsTriggered;
		job.lastRun = house.jobsRegistered[name].lastRun ? date.getFriendlyDate(house.jobsRegistered[name].lastRun) : '<i>Never</i>';
		model.jobs.push(job);
	}

	return model;
};