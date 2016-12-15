module.exports = function(house){
	house.listenForEvent('switchStatus', function(args){
		house.recordTriggeredListener('switchStatus');
		// Log the history
		var oldState = house.getStatus('plugs');
		var newState = null;
		for(var switchName in oldState){
			if(args[switchName] != oldState[switchName]){
				newState = args[switchName] ? 'on' : 'off';
				house.logHistory('The switch: "' + switchName + '" was turned ' + newState + '.');
			}
		}	
		house.setStatus('plugs', args);
	});
};