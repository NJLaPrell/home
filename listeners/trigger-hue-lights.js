// Imported Modules
var Listener = require('../helpers/listener.js');
var Hue = require('../helpers/hue-lights.js');

var settings = {
	name: 'Hue Lights Command',
	eventsListened: ['trigger-hueLights']
};

var listener = new Listener(settings);

listener.setListener(function(house){
	var hue = new Hue(house);
	house.listenForEvent('trigger-hueLights', function(args){
		house.recordTriggeredListener('trigger-hueLights');
		if(args.direction){
			hue.toggleState(args.lightID, args.direction);
		} else if(args.bri){
			hue.setBrightness(args.lightID, args.bri);
		} else if(args.rgb){
			var rgb = [args.rgb.r, args.rgb.g, args.rgb.b];
			hue.setRGB(args.lightID, rgb);
		}
		
	});
});

module.exports = listener;