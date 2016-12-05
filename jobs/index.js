var schedule = require('node-schedule');

module.exports = function(){
	require('fs').readdirSync(__dirname).forEach(function (file) {
	  if (file == 'index.js' || file.split("._").length > 1) return;
	  var job = require('./' + file);
	  schedule.scheduleJob(job.schedule, job.job);
	});
};