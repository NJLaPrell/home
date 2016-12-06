var SMTPConnection = require('smtp-connection');
var log = require('./log.js');

module.exports = function(msg){
	var conf = require('../config');
	var message = 'From: LaPrell Home <' + conf.smtpEnvelope.from + '>\r\n';
	message	+= 'To: IFTTT <' + conf.smtpEnvelope.to + '>\r\n';
	message	+= 'Subject: ' + conf.smtpMessage.subject + '\r\n';
	message	+= '\r\n';
	message	+= msg;

	var connection = new SMTPConnection(conf.smtpConfig);
	connection.connect(function(){
		connection.login(conf.smtpAuth, function(err){
			if(err !== null){
				log.error(err);
			} else {
				connection.send(conf.smtpEnvelope, message, function(err){
					if(err !== null){
						log.error(err);
					} else {
						log.info("Sent text alert using IFTTT with message: " + msg);
					}
					connection.quit();
				});
			}
		});
	});
};

