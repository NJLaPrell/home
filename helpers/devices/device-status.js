module.exports = function(device){
	this.status = {
		name: device.name,
		id: device.id,
		on: null,
		brightness: null,
		rgb: null,
		hue: null,
		sat: null,
		xy: null,
		ct: null,
		isLight: device.isLight
	};	

	switch (device.type){

		case "edimax-switch":
			this.status.capabilities = ['on'];
		break;

		case "caseta-dimmer":
			this.status.capabilities = ['on', 'brightness'];
		break;

		case "wemo-switch":
			this.status.capabilities = ['on'];
		break;

		case "hue-color":
			this.status.capabilities = ['on', 'brightness', 'rgb', 'hue', 'sat', 'xy', 'ct'];
		break;

		case "hue":
			this.status.capabilities = ['on', 'brightness'];
		break;

	}

	return this.status;

};