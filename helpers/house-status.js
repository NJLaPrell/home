var log = require('./log');

module.exports = {
	status: {
		daytime: null,
		nighttime: null,
		nickslocation: null,
		brendaslocation: null
	},
	getStatus: function(status){
		if(!typeof this.status[status] == undefined){
			return this.status[status];
		} else {
			return false;
		}
	},
	setStatus: function(status, value){
		if(typeof this.status[status] == 'undefined'){
			log.warning("Setting a house status for '" + status + ",' but the status did not previously exist.");
		}
		this.status[status] = value;
	}
}