module.exports = {
	getDate: function(){
		var date = new Date();
		var year = date.getFullYear().toString();
		var month = (date.getMonth()+1).toString();
		month = month < 10 ? '0' + month : month;
		var day = date.getDate().toString();
		day = day < 10 ? '0' + day : day;
		return year + '-' + month + '-' + day;
	},
	getTime: function(){
		var date = new Date();
		var hours = date.getHours();
		var ampm = 'AM';
		if(hours > 12){
			ampm = 'PM';
			hours = hours - 12;
		}
		hours = hours < 10 ? '0' + hours : hours;
		var minutes = date.getMinutes();
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var seconds = date.getSeconds();
		seconds = seconds < 10 ? '0' + seconds : seconds;
		return hours + ':' + minutes + ':' + seconds + ' ' + ampm;
	},
	getDateTime: function(){
		return this.getDate() + ' ' + this.getTime();
	}
};