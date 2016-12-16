module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('sunrise');
		house.logHistory("The sun rose.");
	});
};