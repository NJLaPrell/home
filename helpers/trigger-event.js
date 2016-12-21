var request = require('request');
var conf = require('../config.js'); 
var Log = require('../helpers/log.js');
var log = new Log(conf.debug);

module.exports = function(event, args){
	log.debug("Triggering " + event + " via REST with args: " + JSON.stringify(args));
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