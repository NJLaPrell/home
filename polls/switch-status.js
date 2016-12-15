// Imported Modules
var Poll = require('../helpers/poll.js');
var plug = require('../helpers/smart-plug.js');

var settings = {
	name: 'Switch Status',
	interval: '10 s',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(){
	var status = {};
	var stateResults = [];
	var self = this;
	for(var i=0; i < plug.plugs.length; i++){
		stateResults.push(plug.getState(plug.plugs[i].name));
	}
	Promise.all(stateResults).then(function(res){
		for(var i=0; i< plug.plugs.length; i++){
			status[plug.plugs[i].name] = res[i];
		}
		self.triggerEvent('switchStatus', status);
	});
	
});

module.exports = poll;