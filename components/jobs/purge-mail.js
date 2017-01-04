// Imported Modules
var Job = require.main.require('./helpers/job.js');
var Imap = require('imap');


var settings = {
	name: 'Purge Read Mail from home@laprell.org',
	description: 'Purges "SEEN" email from home@laprell.org 10 minutes past every hour. Security camera motion alert emails are recieved regularly and would quickly fill up the box. As those are processed by the mail listener, they are marked as seen, ready to be purged by this job to keep the mail box managable.',
	schedule: '10 * * * *',
	executeOnStartup: true,
	shutdownThreshold: 0
};

var job = new Job(settings);


job.setJob(function(house){

	house.log.debug("Purge mail job running");
	
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