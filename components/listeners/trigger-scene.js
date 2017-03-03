// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var Hue = require.main.require('./helpers/hue-lights.js');
var Plug = require.main.require('./helpers/smart-plug.js');

var settings = {
	name: 'Scene Trigger',
	description: 'Triggers different custom scenes.',
	eventsListened: ['trigger-scene'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('trigger-scene', function(house, args){
	switch(args.scene) {
		case "dim":
			var hue = new Hue(house);

			// Hue Lights
			hue.setScene("dim");

			// Caseta Lights
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(4, 0);
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(2, 0);
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(5, 0);
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(8, 0);
		break;	

		case "tv":
			var hue = new Hue(house);

			// Hue Lights
			hue.setScene("dim");

			// Caseta Lights
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(4, 0);
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(2, 0);
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(5, 0);
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(8, 0);

			// Switches
			var plug = new Plug(house);
			plug.toggle("TV Backlight", "on");

		break;	

		case "morning":
			var hue = new Hue(house);

			// Hue Lights
			hue.setScene("dim");

			// Caseta Lights
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(4, 0);
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(2, 1);
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(5, 0);

			// Switches
			var plug = new Plug(house);
			plug.toggle("TV Backlight", "off");
			plug.toggle("Wax Warmer", "off");

		break;	

		case "home":
			var hue = new Hue(house);

			// Hue Lights
			hue.setScene("daytime");

			// Caseta Lights
			house.servicesRegistered['Lutron Caseta Hub'].lutron.setBrightness(2, 100);


		break;	
	}
});

module.exports = listener;