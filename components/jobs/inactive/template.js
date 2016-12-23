// Imported Modules
var Job = require.main.require('./helpers/job.js');

var settings = {
	name: '***NAME***',
	schedule: '* * * * *',
	executeOnStartup: true
};

var job = new Job(settings);

job.setJob(function(house){

	// INSERT MAGIC HERE
	
});

module.exports = job;