var plug = require('../helpers/smart-plug.js');

module.exports = function(house){
	house.listenForEvent('switch', function(args){
		house.recordTriggeredListener('switch');
		plug.toggle('Test Plug',args.status);
	});
};