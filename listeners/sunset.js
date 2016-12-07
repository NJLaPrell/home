module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('weather');
		if(args.status == 'sunset'){
			house.setStatus('daytime', false);
			house.setStatus('nighttime', true);
		}
	});
};