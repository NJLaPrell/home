process.env['NODE_TLS_REJECT_UNAUTHORIZED']=0;

var conf = require('../config.js');
var MailListener = require("mail-listener2");



module.exports = function(house){
	
	this.mailListener = new MailListener(conf.imap);

	this.start = function(){
		this.mailListener.start();
	};

	this.stop = function(){
		this.mailListener.stop();
	}	

	this.mailListener.on("server:connected",function(){
		
	});

	this.mailListener.on("mail", function(mail, seqno, attributes){
		house.triggerEvent('email-received', mail);
	});

	this.mailListener.on("error", function(err){
		house.logHistory("MailListener threw an error.");
		house.log.error(err);
	});
};


