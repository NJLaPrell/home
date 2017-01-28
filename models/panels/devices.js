module.exports = function(house){
	var model = {};
	model.rooms = [];

	Object.keys(house.devices.getRoomList()).forEach(function(room){
		model.rooms.push({
			id: room.replace(/ /g,"").replace(/\'/g,"").toLowerCase(),
			name: room
		});
	});

	return model;
};