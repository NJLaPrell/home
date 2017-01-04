// Imported Modules
var Job = require.main.require('./helpers/job.js');

var settings = {
	name: '***NAME***',
	description: '***DESCRIPTION***',
	schedule: '* * * * *',
	eventsTriggered: ['**EVENTS**'],
	executeOnStartup: true,
	shutdownThreshold: 0
};

var job = new Job(settings);

job.setJob(function(house){

	// INSERT MAGIC HERE
	
});

module.exports = job;