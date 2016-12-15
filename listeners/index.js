var fs = require('fs');

module.exports = function(house){
	house.log.startup("Registering listeners");
	fs.readdirSync(__dirname).forEach(function (file) {
	  if (file == 'index.js' || file.split("._").length > 1 || fs.lstatSync(__dirname + "/" + file).isDirectory()) return;
	  var listener = require('./' + file);
	  listener(house);
	});
};