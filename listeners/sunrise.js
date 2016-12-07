module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('weather');
		if(args.status == 'sunrise'){
			house.setStatus('daytime', true);
			house.setStatus('nighttime', false);
		}
	});
};