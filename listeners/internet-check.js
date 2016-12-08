module.exports = function(house){
	house.listenForEvent('internetCheck', function(args){
		house.recordTriggeredListener('internetCheck');
		house.setStatus('internetAccess', args.pass);
		if(house.getStatus('internetDownSince') && args.pass){
			house.setStatus('internetDownSince', null);
		} else if(house.getStatus('internetDownSince') == null && args.fail){
			house.setStatus('internetDownSince', date.toString());
		}	
	});
};