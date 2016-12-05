var stackTrace = require('stack-trace');

module.exports = {
	getScript: function(script){
		if(!script){

			return stackTrace.get()[3].getFileName();
		} else {
			return script;
		}
	},
	log: function(msg, type, script){
		var currentDate = new Date();
		script = this.getScript(script);
		console.log(currentDate.toString() + "\r\n" + type + ": " + script + "\r\n" + msg + "\r\n\r\n");
	},
	error: function(msg, script){
		//var trace = "\r\nTRACE -- file: " + stackTrace.getFileName() + " Function: " + stackTrace.getFunctionName() + " Line: " + stackTrace.getLineNumber();		
		this.log(msg, "ERROR", script);
	},
	warning: function(msg, script){
		this.log(msg, "WARNING", script);
	},
	info: function(msg, script){
		this.log(msg, "INFO", script);
	}
};