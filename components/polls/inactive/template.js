// Imported Modules
var Poll = require.main.require('./helpers/poll.js');
var triggerEvent = require.main.require('./helpers/trigger-event.js');

var settings = {
	name: '***NAME***',
	description: '***DESCRIPTION***',
	interval: '10 s',
	eventsTriggered: ['**EVENTS**'],
	executeOnStartup: true,
	shutdownThreshold: 0
};

var poll = new Poll(settings);

poll.setJob(function(house){
	
	// INSERT MAGIC HERE
	triggerEvent('***SOME EVENT***', params);
	
});

module.exports = poll;