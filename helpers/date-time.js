var moment = require('moment');

module.exports = {
	getDate: function(){
		return moment().format("YYYY-MM-DD");
	},
	getTime: function(){
		return moment().format("hh:mm:ss A");
	},
	getDateTime: function(){
		return moment().format("YYYY-MM-DD hh:mm:ss A");
	}
};