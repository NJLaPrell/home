module.exports = function(house){
	house.listenForEvent('tv-status', function(args){
		house.recordTriggeredListener('tv-status');
		house.setStatus('tvStatus', args.status);
	});
};