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
		console.log(this.getDate() + "\r\n" + type + ": " + script + "\r\n" + msg + "\r\n");
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
			console.log('********** STARTING SERVER ********** (' + this.getDate(script) + ')');
		} else {
			console.log(msg + " (" + this.getScript() + ")");
		}
	},
	getDate: function(){
		var datePieces = {};
		var date = new Date();
		datePieces.y = date.getFullYear().toString();
		datePieces.m = (date.getMonth()+1).toString();
		datePieces.d = date.getDate().toString();
		datePieces.h = date.getHours();
		datePieces.mi = date.getMinutes();
		datePieces.s = date.getSeconds();
		for (var piece in datePieces){
			if(datePieces.hasOwnProperty(piece)){
				datePieces[piece] = datePieces[piece] < 10 ? '0' + datePieces[piece] : datePieces[piece];
			}
		}
		return datePieces.y + '-' + datePieces.m + '-' + datePieces.d + ' ' + datePieces.h + ':' + datePieces.mi + ':' + datePieces.s;
	}
};