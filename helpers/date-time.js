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
	},
	getFriendlyDate: function(date){
		if(!date){
			date = new Date();
		} else {
			date = Date.parse(date);
		}
		return moment(date).fromNow();
	},
	getFriendlyDay: function(date){
		console.log("Date Received: " + date);
		if(!date){
			date = new Date();
		} else {
			date = this.getISODate(date);
		}
		let dayString = moment(date).calendar(null, {sameElse: 'MM/DD/YYYY'});
		console.log(moment(date).local());
		console.log("Day String: " + dayString);
		let dayFrags = dayString.split(" ");
		return dayFrags[0];
	},
	getISODate: function(string){
		let frags = string.split(" ");
		var time = '';
		if(frags.length > 1){
			let ampm = frags[2];
			let timeFrags = frags[1].split(":");
			let hour = ampm == 'PM' ? timeFrags[0] + 12 : timeFrags[0];
			time = 'T' + hour + ':' + timeFrags[1] + ':' + timeFrags[2];
		} else {
			time = 'T00:00:00';
		}
		return frags[0] + time;
	}
};