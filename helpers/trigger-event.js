var request = require('request');
var conf = require('../config.js'); 
var log = require('../helpers/log.js');

module.exports = function(event, args){
	var payload = {
		overrideUser: conf.uName,
		overridePassword: conf.password,
		event: event,
		args: args
	};
	request.post(
	    'http://localhost/home/trigger-event',
	    {json: payload},
	    function (error, response, body) {
	        if (error) {
	            log.error("Unable to trigger '" + event + "'' event: " + error);
	        } 
	    }
	);
};