module.exports = {
	getScript: function(script){
		if(!script && module.parent){
			var components = module.parent.id.split("/");
			return components[(components.length-1)];
		} else if(!script) {
			return '<UNKNOWN SCRIPT>';
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
		this.log(msg, "ERROR", script);
	},
	warning: function(msg, script){
		this.log(msg, "WARNING", script);
	},
	info: function(msg, script){
		this.log(msg, "INFO", script);
	}
};