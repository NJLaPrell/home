process.env['NODE_TLS_REJECT_UNAUTHORIZED']=0;

var conf = require('../config.js');
var MailListener = require("mail-listener2");



module.exports = function(house){
	
	var mailListener = new MailListener(conf.imap);

	mailListener.start();

	mailListener.on("server:connected",function(){
		
	});

	mailListener.on("mail", function(mail, seqno, attributes){
		house.triggerEvent('email-received', mail);
	});

	mailListener.on("error", function(err){
		house.logHistory("MailListener threw an error.");
		house.log.error(err);
	});
};


