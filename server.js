// Config
var house = require('./helpers/house-status');
var express = require('express');
var app =  new express();
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var hueAnimation = require("./helpers/hue-animation");
var roku = require('./helpers/roku');
var Handlebars = require('handlebars');
var fs = require('fs');

house.log.startup();
house.log.startup("STARTING SERVICE: server.js on port: " + house.conf.port);
house.logHistory("Server started.");


//var startJobs = require('./jobs/');
//startJobs(house);


////////////////////////////////////////////////////////////
// Register Event Listeners
////////////////////////////////////////////////////////////
var registerListeners = require('./listeners/');
registerListeners(house);

////////////////////////////////////////////////////////////
// Register Polls
////////////////////////////////////////////////////////////
var registerPolls = require('./polls/');
registerPolls(house);

////////////////////////////////////////////////////////////
// Register Event Listeners
////////////////////////////////////////////////////////////
var registerMailListener = require('./helpers/mail-listener');
registerMailListener(house);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

////////////////////////////////////////////////////////////
// MODERATOR ROUTE
////////////////////////////////////////////////////////////
router.use(function(req, res, next){

	// Check for basic authentication
	var credentials = auth(req);
	if(req.body.overrideUser || req.query.overrideUser){
		credentials = {
			name: req.body.overrideUser ? req.body.overrideUser : req.query.overrideUser,
			pass: req.body.overridePassword ? req.body.overridePassword : req.query.overridePassword
		};
	} 
	if(!credentials || credentials.name !== house.conf.uName || credentials.pass !== house.conf.password){
		res.status(401).send({"error": "Access Denied - Invalid authentication credentials."});
	} else {
		next();	
	}
});

////////////////////////////////////////////////////////////
// HUE ANIMATION ROUTES
////////////////////////////////////////////////////////////
router.route('/animation').put(function(req, res){
	if(!req.body.method){
		res.status(400).send({"error": "Method Not Defined - A 'method' parameter was not sent."});
	}
	var animation = new hueAnimation();
	switch (req.body.method) {

		case "panic":
		animation.trigger("panic");
		break;

		default:
			res.status(404).send({"error": "Method Not Found - The animation '" + req.body.method + "' does not exist."});
		break;

	}
	res.status(200).send({"message": "Success - The animation '" + req.body.method + "' has been executed."});
});

////////////////////////////////////////////////////////////
// ROKU TV ROUTES
////////////////////////////////////////////////////////////
router.route('/tv').put(function(req, res){
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

////////////////////////////////////////////////////////////
// EVENT TRIGGER ROUTE
////////////////////////////////////////////////////////////
router.route('/trigger-event').post(function(req, res){
	if(!req.body.event){
		res.status(400).send({"error": "Event Not Defined - An 'event' parameter was not sent."});
	} else {
		var args = req.body.args ? req.body.args : {};
		house.triggerEvent(req.body.event, args);
		res.status(200).send({"message": "Event '" + req.body.event + "' has been triggered with " + args + "."});	
	}
});

router.route('/status').get(function(req, res){
	res.status(200).send(house.getStatusReport());
});

router.route('/debug').get(function(req, res){
	res.status(200).send(house.getDebugInfo());
});


router.route('/dashboard').get(function(req, res){
	fs.readFile(__dirname + '/templates/dashboard.html', 'utf8', function(err, html){
		var template = Handlebars.compile(html);
		var model = require("./models/dashboard.js");
		res.send(template(model(house)));
	});
});

// Rout all the calls through /home
app.use('/home', router);

app.use(express.static('static'));

app.listen(house.conf.port);

