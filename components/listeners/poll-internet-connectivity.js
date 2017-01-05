// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var HueAnimation = require.main.require('./helpers/hue-animation.js');
var date = require.main.require('./helpers/date-time.js');

var settings = {
	name: 'Internet Status',
	description: 'Recieves the internet polling data and updates the house status. If the internet goes out, Hue Animcation panic mode is triggered. Out and back states are logged in the history.',
	eventsListened: ['poll-internet-connectivity'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('poll-internet-connectivity', function(house, args){

	// Set the internetAccess status variable
	house.setStatus('internetAccess', args.pass);
	
	var outSince = house.getStatus('internetOutSince');

	// The internet just came back up
	if(outSince !== null && args.pass){
		house.logHistory("The internet came back online.");
		house.setStatus('internetOutSince', null);
	// The internet just went down
	} else if(outSince === null && !args.pass){
		house.logHistory("The internet was out.");
		house.setStatus('internetOutSince', date.getDateTime());
		var animation = new HueAnimation();
		animation.trigger("panic", 30);
	}	
});

module.exports = listener;