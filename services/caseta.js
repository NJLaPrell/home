// Imported Modules
var Service = require('../helpers/service.js');
var Lutron = require('../helpers/lutron.js');

var settings = {
	name: 'Lutron Caseta Hub',
	type: 'Telnet'
};

var service = new Service(settings);

service.setService(function(house){
	house.lutron = new Lutron(house);
	house.lutron.connect();
});

module.exports = service;