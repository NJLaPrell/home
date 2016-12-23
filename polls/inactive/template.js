// Imported Modules
var Poll = require('../helpers/poll.js');
var triggerEvent = require('../helpers/trigger-event.js');

var settings = {
	name: '***NAME***',
	interval: '10 s',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(house){
	
	// INSERT MAGIC HERE
	triggerEvent('***SOME EVENT***', params);
	
});

module.exports = poll;