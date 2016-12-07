process.env['NODE_TLS_REJECT_UNAUTHORIZED']=0;

var conf = require('../config.js');
var log = require('./log.js');
var MailListener = require("mail-listener");


module.exports = function(eventEmitter){
	var mailListener = new MailListener(conf.imap);

	mailListener.start();

	mailListener.on("server:connected",function(){
		log.info("MailListener has connected.");
	});

	mailListener.on("mail:parsed", function(mail){
		eventEmitter.emit('email-received', mail);
	});
};


