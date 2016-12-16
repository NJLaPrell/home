// Imported Modules
var Listener = require('../helpers/listener.js');
var HueAnimation = require('../helpers/hue-animation.js');
var date = require('../helpers/date-time.js');

var settings = {
	name: 'Internet Status',
	eventsListened: ['internetCheck']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	house.listenForEvent('internetCheck', function(args){
		house.recordTriggeredListener('internetCheck');

		// Set the internetAccess status variable
		house.setStatus('internetAccess', args.pass);
		
		var outSince = house.getStatus('internetOutSince');

		// The internet just came back up
		if(outSince !== null && args.pass){
			house.logHistory("The internet is back online.");
			house.setStatus('internetOutSince', null);
		// The internet just went down
		} else if(outSince === null && !args.pass){
			house.logHistory("The internet is out.");
			house.setStatus('internetOutSince', date.getDateTime());
			var animation = new HueAnimation();
			animation.trigger("panic", 30);
		}	
	});
});

module.exports = listener;