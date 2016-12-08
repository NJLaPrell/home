module.exports = function(house){
	house.listenForEvent('gps', function(args){
		house.recordTriggeredListener('gps');
		var person = args.person == 'nick' ? 'nickslocation' : 'brendaslocation';
		house.setStatus(person, args.location);
	});
};