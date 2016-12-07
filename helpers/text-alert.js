var SMTPConnection = require('smtp-connection');
var log = require('./log.js');
var conf = require('../config');

module.exports = function(msg){	
	var message = 'From: LaPrell Home <' + conf.textAlert.smtpEnvelope.from + '>\r\n';
	message	+= 'To: IFTTT <' + conf.textAlert.smtpEnvelope.to + '>\r\n';
	message	+= 'Subject: ' + conf.textAlert.subject + '\r\n';
	message	+= '\r\n';
	message	+= msg;
	var connection = new SMTPConnection(conf.textAlert.smtpConfig);
	connection.connect(function(){
		connection.login(conf.textAlert.smtpAuth, function(err){
			if(err !== null){
				log.error(err);
			} else {
				connection.send(conf.textAlert.smtpEnvelope, message, function(err){
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

