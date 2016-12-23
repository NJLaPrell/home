// Imported Modules
var Poll = require.main.require('./helpers/poll.js');
var ping = require('ping');

var settings = {
	name: 'Internet Status',
	interval: '10 s',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(){
	var self = this;
	ping.sys.probe("8.8.8.8", function(isAlive){
		self.triggerEvent('internetCheck', {pass:isAlive});
	});
});

module.exports = poll;