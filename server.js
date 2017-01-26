
// Config
var house = require('./helpers/house-status');

// Handle uncaught exceptions so the server does not force restart.
//process.on('uncaughtException', function (err) {
//   house.log.error(err);
//}); 

// Initialize Express and Socket.io
var express = require('express');
var app =  new express();
app.use(express.static(__dirname + '/home/socket/'));
var server = app.listen(house.conf.port);
var io = require('socket.io').listen(server, { path: '/home/socket/socket.io' });

var bodyParser = require('body-parser');
var auth = require('basic-auth');

var roku = require('./helpers/roku');
var Handlebars = require('handlebars');
var fs = require('fs');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var WatchJS = require("melanke-watchjs");
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

var compression = require('compression');
app.use(compression());

//===============PASSPORT=================
// Use the LocalStrategy within Passport to login/"signin" users.
passport.use('local-signin', new LocalStrategy(
	function(username, password, done) {
		if(username != house.conf.uName){
			return done(null, false);
		}
		if(password != house.conf.uPass){
			return done(null, false);
		}
		return done(null, username);
	  }	
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});




////////////////////////////////////////////////////////////
// Log the Start Sequence
////////////////////////////////////////////////////////////
house.log.startup();
house.log.startup("STARTING SERVICE: server.js on port: " + house.conf.port);
house.logHistory("Server started.");

////////////////////////////////////////////////////////////
// Run Startup Sequence
////////////////////////////////////////////////////////////

house.initializePolls();
house.initializeListeners();
house.initializeJobs();
house.initializeServices();





app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({secret: house.conf.sessionSecret, saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

var router = express.Router();

////////////////////////////////////////////////////////////
// MODERATOR ROUTE
////////////////////////////////////////////////////////////

router.use(function(req, res, next){
	var credentials = auth(req);
	// Check for basic authentication
	if(req.body.overrideUser || req.query.overrideUser || credentials){
		if(req.body.overrideUser || req.query.overrideUser){
			credentials = {
				name: req.body.overrideUser ? req.body.overrideUser : req.query.overrideUser,
				pass: req.body.overridePassword ? req.body.overridePassword : req.query.overridePassword
			};
		}
		if(credentials.name == house.conf.uName && credentials.pass == house.conf.password){
			next();
		} else {
			res.status(401).send({"error": "Access Denied - Invalid authentication credentials."});
		}
	// Check for passport authentication
	} else if (req.isAuthenticated() || req.url == '/signin') { 
		next(); 
	} else {
	  req.session.error = 'Please sign in!';
	  res.redirect('/home/signin');
	}
	
});

////////////////////////////////////////////////////////////
// HUE ANIMATION ROUTES
////////////////////////////////////////////////////////////
router.route('/animation').put(function(req, res){
	if(!req.body.method){
		res.status(400).send({"error": "Method Not Defined - A 'method' parameter was not sent."});
	}
	args = {};
	switch (req.body.method) {

		case "panic":
			args.panic = true;
		break;

		default:
			res.status(404).send({"error": "Method Not Found - The animation '" + req.body.method + "' does not exist."});
		break;

	}
	house.triggerEvent('trigger-hue-animation', args);
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

////////////////////////////////////////////////////////////
// Status Route
////////////////////////////////////////////////////////////
//router.route('/status').get(function(req, res){
//	res.status(200).send(house.getStatusReport());
//});

////////////////////////////////////////////////////////////
// Debug Route
////////////////////////////////////////////////////////////
router.route('/debug').get(function(req, res){
	var util = require('util');
	res.status(200).send(util.inspect(house.getDebugInfo(),{ showHidden: true, depth: null }));
});

////////////////////////////////////////////////////////////
// Dashboard Routes
////////////////////////////////////////////////////////////
var path = require('path');
router.route('/dashboard').get(function(req, res){
	res.sendFile(path.join(__dirname + '/static/pages/index.html'));
});

router.route('/dashboard/log').get(function(req, res){
	renderAndSend('log', 'log', res);
});

router.route('/dashboard/details').get(function(req, res){
	renderAndSend('details', 'details', res);
});

router.route('/dashboard/events').get(function(req, res){
	renderAndSend('events', 'event-log', res);
});

router.route('/dashboard/details/jobs-registered').get(function(req, res){
	renderAndSend('jobs-registered', 'jobs-registered', res);
});

router.route('/dashboard/details/services-registered').get(function(req, res){
	renderAndSend('services-registered', 'services-registered', res);
});

router.route('/dashboard/details/polls-registered').get(function(req, res){
	renderAndSend('polls-registered', 'polls-registered', res);
});

router.route('/dashboard/details/listeners-registered').get(function(req, res){
	renderAndSend('listeners-registered', 'listeners-registered', res);
});

router.route('/dashboard/details/event-roster').get(function(req, res){
	renderAndSend('event-roster', 'event-roster', res);
});

////////////////////////////////////////////////////////////
// Dashboard Socket.io Events
////////////////////////////////////////////////////////////

io.on('connection', function(socket) {

	renderAndWatch(house.status.temperature, false, 'panels/temperature', house.status.temperature, 'update-temperature', socket);

	renderAndWatch(house.status, "currentWeather", 'panels/weather', 'panels/weather', 'update-weather', socket);

	renderAndWatch(house.status, ["daytime","nighttime","nickslocation","brendaslocation","powered","InternetAccess","upsStatus"], 'panels/status', 'panels/status', 'update-status-panel', socket);

	renderAndWatch(house.status, ["powered","internetAccess","motionLastDetected"], 'panels/alerts', 'panels/alerts', 'update-alerts-panel', socket);

	renderAndWatch(house.status, ["motionLastDetected","lastRDPConnection","upsStatus"], 'panels/misc', 'panels/misc', 'update-misc-panel', socket);

	renderTemplate('panels/devices', 'panels/devices', function(page){
		socket.emit('load-devices-panel', {html:page});
		house.log.debug("Rendering template for socket.io event: load-devices-panel");
	});

	house.conf.deviceLayout.forEach(function(group){
		var watchers = [];
		var room = group.room;
		group.devices.forEach(function(device){
			if(device.type == 'caseta-dimmer'){
				watchers.push('caseta');
			} else if(device.type == 'hue-color' || device.type == 'hue'){
				watchers.push('hue');
			} else if(device.type == 'edimax-switch'){
				watchers.push('plugs');
			} else if(device.type == 'wemo-switch'){
				watchers.push('wemo');
			}
		});
		var render = function(){
			fs.readFile(__dirname + '/templates/panels/device.hbs', 'utf8', function(err, html){
				template = Handlebars.compile(html);
				var model = require("./models/panels/device.js")(house, room);	
				socket.emit('update-device-panel', {html:template(model), room:model.room, isLighted:model.isLighted});
				house.log.debug("Rendering template for socket.io event: update-device-panel for room: " + model.room);
			});	
		};
		watchers.forEach(function(watchVariable){
			watch(house.status[watchVariable], function(){
				render();	
			});	
		});
		render();
	});

});



////////////////////////////////////////////////////////////
// Signin Route
////////////////////////////////////////////////////////////
router.route('/signin').get(function(req, res){
	fs.readFile(__dirname + '/templates/signin.html', 'utf8', function(err, html){
		var template = Handlebars.compile(html);
		res.send(template());
	});
});

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/home/login', passport.authenticate('local-signin', {
  successRedirect: '/home/dashboard',
  failureRedirect: '/home/signin'
  })
);

// Route all the calls through /home
app.use('/home', router);

app.use('/static', express.static(__dirname + '/static'));




console.log('********* STARTUP COMPLETE **********\r\n\r\n');
house.triggerEvent('startup-complete');


////////////////////////////////////////////////////////////
// Utility Functions
////////////////////////////////////////////////////////////

// Render the template and trigger socket.io event, then setup a watch for further renders.
function renderAndWatch(watchObject, watchProperties, template, model, eventName, socket){
	var render = function() {
		renderTemplate(template, model, function(page){
			socket.emit(eventName, {html:page});
			house.log.debug("Rendering template for socket.io event: " + eventName);
		});
	};
	render();
	if(watchProperties){
		watch(watchObject, watchProperties, function(){
			render();
		});	
	} else {
		watch(watchObject, function(){
			render();
		});		
	}
}

// Render the given model and template. Model can be a path or an object.
function renderTemplate(template, model, cb){
	fs.readFile(__dirname + '/templates/' + template + '.hbs', 'utf8', function(err, html){
		template = Handlebars.compile(html);
		if(typeof model == 'string'){
			model = require("./models/" + model + ".js")(house);
		}
		cb(template(model));
	});	
}

function renderAndSend(template, model, res){
	renderTemplate(template, model, function(page){
		res.send(page);
	});
}
