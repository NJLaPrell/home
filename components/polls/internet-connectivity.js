// Imported Modules
var Poll = require.main.require('./helpers/poll.js');
var ping = require('ping');

var settings = {
	name: 'Internet Status',
	description: 'Pings Google DNS server to report on internet connectivity.',
	interval: '10 s',
	eventsTriggered: 'poll-internet-connectivity',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(){
	var self = this;
	ping.sys.probe("8.8.8.8", function(isAlive){
		self.triggerEvent('poll-internet-connectivity', {pass:isAlive});
	});
});

module.exports = poll;