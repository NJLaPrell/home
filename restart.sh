#!/bin/bash
APPROOT="/home/pi/webapps/home"
forever stop --sourceDir $APPROOT --workingDir $APPROOT --workingDir $PWD -t $APPROOT"/server.js"
rm $APPROOT/logs/*.log
forever start -a --sourceDir $APPROOT --workingDir $APPROOT -l $APPROOT"/logs/log.log" -e $APPROOT"/logs/error.log" server.js
