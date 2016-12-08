module.exports = function(house){
	house.listenForEvent('ups-status', function(args){
		house.recordTriggeredListener('ups-status');
		house.setStatus('upsStatus', args);
	});
};