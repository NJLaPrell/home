// Imported Modules
var Service = require.main.require('./helpers/service.js');
var Lutron = require.main.require('./helpers/lutron.js');

var settings = {
	name: 'Lutron Caseta Hub',
	type: 'Telnet',
	description: 'Listens to the Lutron Caseta Hub and issues commands sent by the trigger while updating house status with broadcasts from the hub.'
};

var service = new Service(settings);

service.setService(function(house){
	house.lutron = new Lutron(house);
	house.lutron.connect();
});

module.exports = service;