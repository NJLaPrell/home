// Imported Modules
var Poll = require.main.require('./helpers/poll.js');
var Plug = require.main.require('./helpers/smart-plug.js');

var settings = {
	name: 'Switch Status',
	interval: '10 s',
	executeOnStartup: true
};

var poll = new Poll(settings);

poll.setJob(function(house){
	var status = {};
	var stateResults = [];
	var self = this;
	var plug = new Plug(house);
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