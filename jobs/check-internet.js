// Imported Modules
var roku = require('../helpers/roku'); 
log = require('../helpers/log.js');

// Define the job
module.exports = function(house){
	house.log.startup("Job Scheduled");
	this.house = house;
	this.schedule = '*/1 * * * *';
	this.job = function(house){
		var ops = {
			host: "www.google.com",
			timeout: 1000,
			method: "GET",
			path: "/"
		};
		var http = require('http');
		
		var self = this;

		http.request(ops,function(res){
			house.setStatus('internetAccess', true);
		}).on('error', function(res){
			house.setStatus('internetAccess', false);
		}).end();
	};
	return this;
};