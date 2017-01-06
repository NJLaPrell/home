// Imported Modules
var Listener = require.main.require('./helpers/listener.js');
var alert = require.main.require("./helpers/text-alert.js");

var settings = {
	name: 'Turn Off When Away',
	description: 'Turns off the wax warmer and the lava lamp when the house is no longer occupied.',
	eventsListened: ['house-unoccupied'],
	shutdownThreshold: 0
};

var listener = new Listener(settings);

listener.registerListener('house-unoccupied', function(house, args){
	let devices = '';
	if(house.status.wemo['Lava Lamp'].binaryState == 1){
		devices = 'lava lamp';
		house.triggerEvent('trigger-wemo', {device:"Lava Lamp", value:0});
	}
	if(house.status.plugs['Wax Warmer']){
		devices = devices ? ' and wax warmer' : 'wax warmer';
		house.triggerEvent('trigger-edimax-switch', {name:"Wax Warmer", direction:"off"});
	}
	let werewas = house.status.wemo['Lava Lamp'].binaryState == 1 && house.status.plugs['Wax Warmer'] ? 'were' : 'was';
	alert("The " + devices + " " + werewas + " left on, but now automatically shut off since nobody is home.");
});

module.exports = listener;