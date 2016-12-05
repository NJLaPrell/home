var log = require("./helpers/log.js");
log.info("Starting jobs.js service");

var startJobs = require('./jobs/');
startJobs();