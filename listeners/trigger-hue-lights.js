var Hue = require('../helpers/hue-lights.js');

module.exports = function(house){

	var hue = new Hue(house);

	// Make sure we have Hue Light data available
	hue.getState().then(function(response){
		house.setStatus('hue', response);
		house.log.startup("Retrieved Hue status data.");
	});
	

	house.listenForEvent('trigger-hueLights', function(args){
		house.recordTriggeredListener('trigger-hueLights');

	
		

	});
};