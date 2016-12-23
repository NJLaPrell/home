// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var Hue = require.main.require('./helpers/hue-lights.js');

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
		} else if(args.colorPreset){
			hue.setRGB(args.lightID, house.colorPreset[args.colorPreset]);
		} else if(args.christmasMode){
			if(args.toggle == 'on'){
				hue.setBrightness(1, 255);
				hue.setBrightness(3, 255);
				hue.setRGB(1, house.colorPreset.red);
				hue.setRGB(3, house.colorPreset.green);
				hue.toggleState(4, 'off');
			} else {
				hue.setBrightness(1, 255);
				hue.setBrightness(3, 255);
				hue.setRGB(1, house.colorPreset.warm);
				hue.setRGB(3, house.colorPreset.warm);
				hue.toggleState(4, 'on');
			}
		}
		
	});
});

module.exports = listener;