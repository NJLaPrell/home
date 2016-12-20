// Config
var house = require('./helpers/house-status');

var express = require('express');
var app =  new express();

var bodyParser = require('body-parser');
var auth = require('basic-auth');

var roku = require('./helpers/roku');
var Handlebars = require('handlebars');
var fs = require('fs');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var funct = function(username, password){
	return true;
};

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
// Register Jobs
////////////////////////////////////////////////////////////
var startJobs = require('./jobs/');
startJobs(house);

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

app.use(cookieParser());
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
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
	house.triggerEvent('trigger-hueAnimation', args);
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
router.route('/status').get(function(req, res){
	res.status(200).send(house.getStatusReport());
});

////////////////////////////////////////////////////////////
// Debug Route
////////////////////////////////////////////////////////////
router.route('/debug').get(function(req, res){
	res.status(200).send(house.getDebugInfo());
});

////////////////////////////////////////////////////////////
// Dashboard Route
////////////////////////////////////////////////////////////
router.route('/dashboard').get(function(req, res){
	fs.readFile(__dirname + '/templates/dashboard.html', 'utf8', function(err, html){
		var template = Handlebars.compile(html);
		var model = require("./models/dashboard.js");
		res.send(template(model(house)));
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

// Rout all the calls through /home
app.use('/home', router);

app.use(express.static('static'));

app.listen(house.conf.port);

