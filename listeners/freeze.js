module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('weather');
		if(args.status == 'freezeing'){
			house.log.info("LISTENER: It is below freezing.");
		}
	});
};