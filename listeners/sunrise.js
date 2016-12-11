module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('weather');
		if(args.status == 'sunrise'){
			house.logHistory("The sun rose.");
			house.setStatus('daytime', true);
			house.setStatus('nighttime', false);
		}
	});
};