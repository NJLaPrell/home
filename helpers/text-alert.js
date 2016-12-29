var SMTPConnection = require('smtp-connection');
var conf = require('../config');
var Log = require('./log.js');
var log = new Log(conf.debug);

module.exports = function(msg){	
	log.debug("Sending text alert: " + msg);
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
					}
					connection.quit();
				});
			}
		});
	});
};

