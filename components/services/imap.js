// Imported Modules
var Service = require.main.require('./helpers/service.js');
var registerMailListener = require.main.require('./helpers/mail-listener');

var settings = {
	name: 'Home@LaPrell.org Mail Listener',
	type: 'IMAP'
};

var service = new Service(settings);

service.setService(function(house){
	registerMailListener(house);
});

module.exports = service;