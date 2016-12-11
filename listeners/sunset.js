module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('weather');
		if(args.status == 'sunset'){
			house.logHistory("The sun set.");
			house.setStatus('daytime', false);
			house.setStatus('nighttime', true);
		}
	});
};