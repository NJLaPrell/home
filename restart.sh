#!/bin/bash
APPROOT="/home/pi/webapps/home"
forever stop --sourceDir $APPROOT --workingDir $APPROOT --workingDir $PWD -t $APPROOT"/server.js"
forever stop --sourceDir $APPROOT --workingDir $APPROOT --workingDir $PWD -t $APPROOT"/wemo.js"
rm $APPROOT/logs/*.log
forever start -a --sourceDir $APPROOT --workingDir $APPROOT -l $APPROOT"/logs/log.log" -e $APPROOT"/logs/error.log" server.js
forever start -a --sourceDir $APPROOT --workingDir $APPROOT -l $APPROOT"/logs/log.log" -e $APPROOT"/logs/error.log" wemo.js
