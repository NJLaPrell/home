var HueAnimation = require('../helpers/hue-animation.js');
var date = require('../helpers/date-time.js');

module.exports = function(house){
	house.listenForEvent('internetCheck', function(args){
		house.recordTriggeredListener('internetCheck');

		// Set the internetAccess status variable
		house.setStatus('internetAccess', args.pass);
		
		var outSince = house.getStatus('internetOutSince');

		// The internet just came back up
		if(outSince !== null && args.pass){
			house.setStatus('internetOutSince', null);
			house.log.info("Internet just came back up");
		// The internet just went down
		} else if(outSince === null && !args.pass){
			house.log.info("Internet just went down");
			house.setStatus('internetOutSince', date.getDateTime());
			var animation = new HueAnimation();
			animation.trigger("panic");
		}	
	});
};