process.env['NODE_TLS_REJECT_UNAUTHORIZED']=0;

var conf = require.main.require('./config.js');
var MailListener = require("mail-listener2");


// Imported Modules
var Service = require.main.require('./helpers/service.js');
var registerMailListener = require.main.require('./helpers/mail-listener');

var settings = {
	name: 'Home@LaPrell.org Mail Listener',
	type: 'IMAP',
	description: 'Monitors the IMAP connection and fires the "email-received" event with the mail as the parameter.',
	eventTriggers: ['email-received'],
	shutdownThreshold: 10
};

var service = new Service(settings);

service.setService(function(house){
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
	return this;
});

module.exports = service;