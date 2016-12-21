var date = require('./date-time.js');
module.exports = function(debug){

	this.debugState = debug ? debug : false;

	this.getScript = function(script){
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
	};

	this.log = function(msg, type, script){
		script = this.getScript(script);
		console.log(date.getDateTime() + "\r\n" + type + ": " + script + "\r\n" + msg + "\r\n");
	};

	this.error = function(msg, script){	
		this.log(msg, "ERROR", script);
	};

	this.warning = function(msg, script){
		this.log(msg, "WARNING", script);
	};

	this.info = function(msg, script){
		this.log(msg, "INFO", script);
	};

	this.startup = function(msg){
		if(!msg){
			console.log('********** STARTING SERVER ********** (' + date.getDateTime() + ')');
		} else {
			console.log(msg);
		}
	};

	this.debug = function(msg){
		if(this.debugState){
			console.log(date.getDateTime() + " - DEBUG: " + msg + "\r");
		}
	}

	this.setDebug = function(debug){
		this.debugState = debug;
	};

	return this;
};