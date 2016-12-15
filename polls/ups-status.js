// Imported Modules
var Poll = require('../helpers/poll.js');

var settings = {
	name: 'UPS Status',
	interval: '1 m',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(){
	var self = this;
	var exec = require('child_process').exec;
	exec('apcaccess', function(error, stdout, stderr) {
		var status = {};
	  	var lines = stdout.split("\n");
	  	for(var i = 0; i < lines.length; i++){
	  		if(lines[i]){
	  			var stat = lines[i].split(":");
	  			status[stat[0].trim()] = stat[1].trim();
	  		}
	  	}
	  	var simpleStatus = {
	  		status: status.STATUS,
	  		startTime: status.STARTTIME,
	  		lineVoltage: status.LINEV,
	  		loadPercent: status.LOADPCT,
	  		batteryCharge: status.BCHARGE,
	  		timeLeft: status.TIMELEFT,
	  		batteryVoltage: status.BATTV,
	  		timeOnBattery: status.TONBATT
	  	};
	  	self.triggerEvent('ups-status', simpleStatus);
	});
});

module.exports = poll;