#!/bin/bash
APPROOT="/home/pi/webapps/home"
rm $APPROOT/logs/*.log
forever start -a --sourceDir $APPROOT --workingDir $APPROOT -l $APPROOT"/logs/log.log" -e $APPROOT"/logs/error.log" server.js
