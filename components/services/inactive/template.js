// Imported Modules
var Service = require.main.require('./helpers/service.js');

var settings = {
	name: '***NAME***',
	type: '***TYPE OF SERVICE***',
	eventsTriggered: ['**EVENTS**'],
	description: '***DESCRIPTION***',
	shutdownThreshold: 0
};

var service = new Service(settings);

service.setService(function(house){
	// INSERT MAGIC HERE
});

module.exports = service;