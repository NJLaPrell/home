var plug = require('../helpers/smart-plug.js');

module.exports = function(house){
	house.listenForEvent('toggleSwitch', function(args){
		house.recordTriggeredListener('toggleSwitch');
		plug.toggle(args.name, args.direction);
	});
};