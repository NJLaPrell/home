// Imported Modules
Log = require('../helpers/log.js');
log = new Log();
var conf = require('../config.js');
var Imap = require('imap');


// Log the started schedule
log.startup("Job Scheduled");

// Define the job
module.exports = {
	schedule: '5 * * * *', 
	job: function(){
		console.log("Purge mail job running");
		var settings = conf.imap;
		settings.searchFilter = ['SEEN'];
		settings.user = settings.username;

		var imap = new Imap(settings);

		imap.once('ready', function() {
		  imap.openBox('INBOX', false, function(err, box) {
		    imap.search([ 'SEEN' ], function(err, results) {
		    	if(results.length){
			    	imap.setFlags(results, 'Deleted', function(err) {
			      		imap.closeBox(true, function(err){
			      			imap.end();
			      		});
			      	});
		    	} else {
		    		imap.closeBox(true, function(err){
		      			imap.end();
		      		});
		    	}
		    });
		  });
		});

		imap.connect();

	}
};