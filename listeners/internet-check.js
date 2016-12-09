var HueAnimation = require('../helpers/hue-animation.js');

module.exports = function(house){
	house.listenForEvent('internetCheck', function(args){
		house.recordTriggeredListener('internetCheck');

		// Set the internetAccess status variable
		house.setStatus('internetAccess', args.pass);

		// The internet just came back up
		if(house.getStatus('internetDownSince') && args.pass){
			house.setStatus('internetDownSince', null);
			
		// The internet just went down
		} else if(house.getStatus('internetDownSince') == null && args.fail){
			house.setStatus('internetDownSince', date.toString());
			var animation = new HueAnimation();
			animation.trigger("panic");
		}	
	});
};