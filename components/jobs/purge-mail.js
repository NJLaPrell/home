// Imported Modules
var Job = require.main.require('./helpers/job.js');
var Imap = require('imap');


var settings = {
	name: 'Purge Read Mail from home@laprell.org',
	schedule: '10 * * * *',
	executeOnStartup: true
};

var job = new Job(settings);


job.setJob(function(house){

	house.log.info("Purge mail job running");
	
	var settings = house.conf.imap;
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
	
});

module.exports = job;