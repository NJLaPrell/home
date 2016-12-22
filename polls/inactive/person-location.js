// Imported Modules
var Poll = require('../helpers/poll.js');
var ping = require('ping');

var settings = {
	name: 'Person Location',
	interval: '30 s',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(house){
	var self = this;
	ping.sys.probe(house.conf.nicksPhoneIP, function(isAlive){
		if(!house.getStatus('nickslocation')){
			house.setStatus('nickslocation', (isAlive ? 'home' : 'away'));
		}
		console.log("isAlive: " + isAlive);
		console.log("House Status: " + house.getStatus('nickslocation'));
		if(isAlive && house.getStatus('nickslocation') == 'away'){
			self.triggerEvent('gps', {person:'nick', location: 'home'});
		} else if(!isAlive && house.getStatus('nickslocation') == 'home'){
			self.triggerEvent('gps', {person:'nick', location: 'away'});
		}
	}, {timeout: 15});

	ping.sys.probe(house.conf.brendasPhoneIP, function(isAlive){
		if(!house.getStatus('brendaslocation')){
			house.setStatus('brendaslocation', (isAlive ? 'home' : 'away'));
		}
		if(isAlive && house.getStatus('brendaslocation') == 'away'){
			self.triggerEvent('gps', {person:'brenda', location: 'home'});
		} else if(!isAlive && house.getStatus('brendaslocation') == 'home'){
			self.triggerEvent('gps', {person:'brenda', location: 'away'});
		}
	}, {timeout: 15});
});

module.exports = poll;