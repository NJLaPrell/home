var fs = require('fs');

module.exports = function(house){
	var model = {};
	model.errorLog = fs.readFileSync(__dirname + '/../logs/log.log', 'utf8');
	return model;
};