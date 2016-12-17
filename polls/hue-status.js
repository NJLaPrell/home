// Imported Modules
var Poll = require('../helpers/poll.js');
var Hue = require('../helpers/hue-lights.js');

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
	hue.getAllLightStates().then(function(results){
		self.triggerEvent('status-hueLightStates', results.lights);
	});	
});

module.exports = poll;