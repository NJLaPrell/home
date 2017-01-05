var date = require.main.require('./helpers/date-time.js');

module.exports = function(house){
	var model = {};
	model.jobs = [];
	var job;
	var name;

	let names = Object.keys(house.jobsRegistered);
	names.sort();
	for(var i = 0; i < names.length; i++){
		name = names[i];
		job = {};
		job.name = name;
		job.description = house.jobsRegistered[name].description ? house.jobsRegistered[name].description : '<i>None Given</i>';
		job.schedule = house.jobsRegistered[name].schedule;
		job.executeOnStartup = house.jobsRegistered[name].executeOnStartup
		job.events = house.jobsRegistered[name].eventsTriggered.length ? true : false;
		job.eventsTriggered = house.jobsRegistered[name].eventsTriggered;
		job.lastRun = house.jobsRegistered[name].lastRun ? date.getFriendlyDate(house.jobsRegistered[name].lastRun) : '<i>Never</i>';

		job.icon = !house.jobsRegistered[name].running ? 'stopped' : house.jobsRegistered[name].consecutiveExceptionCount > 0 ? 'warning' : false;
		job.showIcon = job.icon ? true : false;
		job.consecutiveExceptionCount = house.jobsRegistered[name].consecutiveExceptionCount;
		job.exceptionList = house.jobsRegistered[name].exceptionList;
		job.running = house.jobsRegistered[name].running;

		model.jobs.push(job);
	}

	return model;
};