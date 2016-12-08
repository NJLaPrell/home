var schedule = require('node-schedule');
var fs = require('fs');

module.exports = function(){
	fs.readdirSync(__dirname).forEach(function (file) {
	  if (file == 'index.js' || file.split("._").length > 1 || fs.lstatSync(__dirname + "/" + file).isDirectory()) return;
	  var job = require('./' + file);
	  schedule.scheduleJob(job.schedule, job.job);
	});
};