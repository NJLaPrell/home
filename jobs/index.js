

module.exports = function(house){
	var schedule = require('node-schedule');
	var fs = require('fs');
	fs.readdirSync(__dirname).forEach(function (file) {
	  if (file == 'index.js' || file.split("._").length > 1 || fs.lstatSync(__dirname + "/" + file).isDirectory()) return;
	  var Job = require('./' + file);
	  var job = new Job(house);
	  schedule.scheduleJob(job.schedule, job.job(house));
	});
};