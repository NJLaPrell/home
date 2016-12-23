// Imported Modules
var Service = require('../helpers/service.js');

var settings = {
	name: '***NAME***',
	type: '**TYPE OF SERVICE***'
};

var service = new Service(settings);

service.setService(function(house){
	// INSERT MAGIC HERE
});

module.exports = service;