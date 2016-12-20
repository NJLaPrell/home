// Imported Modules
var Poll = require('../helpers/poll.js');
var Hue = require('../helpers/hue-lights.js');
var triggerEvent = require('../helpers/trigger-event.js');

var settings = {
	name: 'Hue Status',
	interval: '10 s',
	executeOnStartup: true
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