#!/bin/bash
APPROOT="/home/pi/webapps/test/home"
rm $APPROOT/logs/*.log
forever start -a --sourceDir $APPROOT --workingDir $APPROOT -l $APPROOT"/logs/log.log" -e $APPROOT"/logs/error.log" server.js
forever start -a --sourceDir $APPROOT --workingDir $APPROOT -l $APPROOT"/logs/log.log" -e $APPROOT"/logs/error.log" wemo.js
forever start -a --sourceDir $APPROOT --workingDir $APPROOT -l $APPROOT"/logs/jobs.log" -e $APPROOT"/logs/error.log" jobs.js
