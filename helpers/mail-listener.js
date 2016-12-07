process.env['NODE_TLS_REJECT_UNAUTHORIZED']=0;

var conf = require('../config.js');
var log = require('./log.js');
var MailListener = require("mail-listener2");

log.startup("MailListener has started.");

module.exports = function(house){
	var mailListener = new MailListener(conf.imap);

	mailListener.start();

	mailListener.on("server:connected",function(){
		log.startup("MailListener has connected.");
	});

	mailListener.on("mail", function(mail, seqno, attributes){
		house.triggerEvent('email-received', mail);
	});

	mailListener.on("error", function(err){
		log.error(err);
	});
};


