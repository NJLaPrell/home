var date = require('./date-time.js');
module.exports = {
	getScript: function(script){
		var originalFunc = Error.prepareStackTrace;
	    var callerfile;
	    try {
	        var err = new Error();
	        var currentfile;
	        Error.prepareStackTrace = function (err, stack) { return stack; };
	        currentfile = err.stack.shift().getFileName();
	        while (err.stack.length) {
	            callerfile = err.stack.shift().getFileName();
	            if(currentfile !== callerfile) break;
	        }
	    } catch (e) {}
	    Error.prepareStackTrace = originalFunc; 
	    return callerfile;
	},
	log: function(msg, type, script){
		script = this.getScript(script);
		console.log(date.getDateTime() + "\r\n" + type + ": " + script + "\r\n" + msg + "\r\n");
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
	},
	startup: function(msg, script){
		if(!msg){
			console.log('********** STARTING SERVER ********** (' + date.getDateTime() + ')');
		} else {
			console.log(msg + " (" + this.getScript() + ")");
		}
	}
};