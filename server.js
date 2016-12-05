// Config
var  conf = require('./config');

var express = require('express');
var app =  new express();
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var hueAnimation = require("./helpers/hue-animation");
var log = require("./helpers/log.js");

log.info("Starting server.js on port: " + conf.port);

var log = function(msg, type){
  var currentDate = new Date();
  console.log(currentDate.toString() + " - " + type + ": server.js\r\n" + msg + "\r\n\r\n");
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

////////////////////////////////////////////////////////////
// MODERATOR ROUTE
////////////////////////////////////////////////////////////
router.use(function(req, res, next){
	// Check for basic authentication
	var credentials = auth(req);
	if(req.body.overrideUser){
		credentials = {
			name: req.body.overrideUser,
			pass: req.body.overridePassword
		};
	} 
	if(!credentials || credentials.name !== conf.uName || credentials.pass !== conf.password){
		res.status(401).send({"error": "Access Denied - Invalid authentication credentials."});
	} else {
		next();	
	}
});

////////////////////////////////////////////////////////////
// HUE ANIMATION ROUTES
////////////////////////////////////////////////////////////
router.route('/animation').put(function(req, res){

	// Throw an error is a method hasn't been defined.
	if(!req.body.method){
		res.status(400).send({"error": "Method Not Defined - A 'method' parameter was not sent."});
	}

	var animation = new hueAnimation();
	switch (req.body.method) {

		case "panic":
		animation.trigger("panic");
		break;

		// The method doesn't exist.
		default:
			res.status(404).send({"error": "Method Not Found - The animation '" + req.body.method + "' does not exist."});
		break;

	}
	// Respond with success
	res.status(200).send({"message": "Success - The animation '" + req.body.method + "' has been executed."});

});

////////////////////////////////////////////////////////////
// ROKU TV ROUTES
////////////////////////////////////////////////////////////
router.route('/tv').put(function(req, res){
	var roku = require('./helpers/roku');
	roku.executeCommand(req.body.method, function(response){
		var payload = {};
		if(response.status!=200){
			payload.error = response.message;
		} else {
			payload.message = response.message;
		}
		res.status(response.status).send(payload);	
	});
});





// Rout all the calls through /home
app.use('/home', router);

app.listen(conf.port);

