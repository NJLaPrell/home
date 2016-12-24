// Imported Modules
var Poll = require.main.require('./helpers/poll.js');
var Hue = require.main.require('./helpers/hue-lights.js');
var triggerEvent = require.main.require('./helpers/trigger-event.js');

var settings = {
	name: 'Hue Status',
	description: 'Polls Hue light status every 10 seconds and syncs the house class.',
	interval: '10 s',
	executeOnStartup: true,
	eventsTriggered: ['status-hueLightStates']
};

var poll = new Poll(settings);

poll.setJob(function(house){
	var status = {};
	var stateResults = [];
	var self = this;	
	hue = new Hue(house);

	// Make sure we have Hue Light data available
	hue.getState().then(function(response){
		house.setStatus('hue', response);
		hue.getAllLightStates().then(function(results){
			triggerEvent('status-hueLightStates', results);
		});	
	});
	
});

module.exports = poll;