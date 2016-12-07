// Config
var  conf = require('./config');

var houseStatus = require('./helpers/house-status');

var express = require('express');
var app =  new express();
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var hueAnimation = require("./helpers/hue-animation");
var log = require("./helpers/log.js");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var roku = require('./helpers/roku');

log.startup();

log.startup("STARTING SERVICE: server.js on port: " + conf.port);

////////////////////////////////////////////////////////////
// Register Event Listeners
////////////////////////////////////////////////////////////
var registerListeners = require('./listeners/');
registerListeners(eventEmitter);

////////////////////////////////////////////////////////////
// Register Event Listeners
////////////////////////////////////////////////////////////
var registerMailListener = require('./helpers/mail-listener');
registerMailListener(eventEmitter);

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
		eventEmitter.emit(req.body.event, args, houseStatus);
		res.status(200).send({"message": "Event '" + req.body.event + "' has been triggered with " + args + "."});	
	}
});

router.route('/status').get(function(req, res){
	res.status(200).send(houseStatus);
});


// Rout all the calls through /home
app.use('/home', router);

app.use(express.static('static'));
app.listen(conf.port);

