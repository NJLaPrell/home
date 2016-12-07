process.env['NODE_TLS_REJECT_UNAUTHORIZED']=0;

var conf = require('../config.js');
var MailListener = require("mail-listener2");



module.exports = function(house){

	house.log.startup("MailListener has started.");
	var mailListener = new MailListener(conf.imap);

	mailListener.start();

	mailListener.on("server:connected",function(){
		house.log.startup("MailListener has connected.");
	});

	mailListener.on("mail", function(mail, seqno, attributes){
		house.triggerEvent('email-received', mail);
	});

	mailListener.on("error", function(err){
		house.log.error(err);
	});
};


