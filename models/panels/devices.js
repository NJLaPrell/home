module.exports = function(house){
	var model = {};

	model.devices = house.conf.deviceLayout;
	model.devices.forEach(function(device, key){
		model.devices[key].id = device.room.replace(/ /g,"").replace(/\'/g,"").toLowerCase();
	});

	return model;
};