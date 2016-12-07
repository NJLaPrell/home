var log = require("./helpers/log.js");
log.startup("STARTING SERVICE");

var startJobs = require('./jobs/');
startJobs();