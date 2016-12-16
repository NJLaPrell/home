module.exports = function(house){
	house.listenForEvent('weather', function(args){
		house.recordTriggeredListener('sunset');
		house.logHistory("The sun set.");
	});
};