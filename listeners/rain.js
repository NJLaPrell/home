module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('weather');
		if(args.status == 'rain'){
			house.log.info("LISTENER: It is raining.");
			house.logHistory("It was raining.");
		}
	});
};