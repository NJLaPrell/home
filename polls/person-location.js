// Imported Modules
var Poll = require('../helpers/poll.js');
var ping = require('ping');

var settings = {
	name: 'Person Location',
	interval: '0 s',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(house){

	var self = this;

	var spawn = require('child_process').spawn;
	
	nickAway = spawn('./away.py', ['-d', house.conf.nicksPhoneIP, '-g', '0', '-os', '10'], {cwd: '/home/pi/webapps/home'});

	nickAway.stdout.on('data', function(data){
		if(data.indexOf("Startup status: Vacant") != -1){
			house.setStatus('nickslocation', 'away');
		} else if(data.indexOf("Startup status: Occupied") != -1){
			house.setStatus('nickslocation', 'home');
		} else if(data.indexOf("Property is occupied") != -1){
			self.triggerEvent('gps', {person:'nick', location: 'home'});
		} else if(data.indexOf("Property is vacant") != -1){
			self.triggerEvent('gps', {person:'nick', location: 'away'});
		} else {
			house.log.warning("Unexpected output from away.py: " + String(data));
		}
	});

	brendaAway = spawn('./away.py', ['-d', house.conf.brendasPhoneIP, '-g', '0', '-os', '10'], {cwd: '/home/pi/webapps/home'});

	brendaAway.stdout.on('data', function(data){
		if(data.indexOf("Startup status: Vacant") != -1){
			house.setStatus('brendaslocation', 'away');
		} else if(data.indexOf("Startup status: Occupied") != -1){
			house.setStatus('brendaslocation', 'home');
		} else if(data.indexOf("Property is occupied") != -1){
			self.triggerEvent('gps', {person:'brenda', location: 'home'});
		} else if(data.indexOf("Property is vacant") != -1){
			self.triggerEvent('gps', {person:'brenda', location: 'away'});
		} else {
			house.log.warning("Unexpected output from away.py: " + String(data));
		}
	});


});

module.exports = poll;