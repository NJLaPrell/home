// Imported Modules
var Listener = require.main.require('./helpers/listener.js');

var settings = {
	name: 'Office Temperature',
	description: 'Updates sensor data for office temperature.',
	eventsListened: ['sensor-tmp-office'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('sensor-tmp-office', function(house, args){
	var temp = parseFloat(args.value).toFixed(1);
	if(isNaN(temp)){
		house.log.warning("Temp calculation is NaN. Reported value is: " + args.value);
	} else {
		house.status.temperature.office = parseFloat(args.value).toFixed(1);	
	}
	
});

module.exports = listener;